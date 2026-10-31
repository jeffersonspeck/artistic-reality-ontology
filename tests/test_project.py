"""Verification script for the ARO repository (SABiOx evaluation activity).

Run with:  python tests/test_project.py

It checks syntax, structure, constraints and query answers. It does NOT check that
the domain theory is correct; that requires expert and real-case evaluation.
Each section stops at the first failed assertion with a message naming the culprit.
"""
from pathlib import Path
import json
import subprocess
import sys

from jsonschema import Draft202012Validator, FormatChecker
from pyshacl import validate
from rdflib import Graph, Literal, Namespace, OWL, RDF
from rdflib.namespace import RDFS, SKOS

ROOT = Path(__file__).resolve().parents[1]
ns = Namespace('https://w3id.org/aro/ontology#')
SH = Namespace('http://www.w3.org/ns/shacl#')


def read(path):
    """Read a repository file as UTF-8 (the Windows default codepage would garble Portuguese text)."""
    return (ROOT / path).read_text(encoding='utf-8')


# --- 1. Single source of truth --------------------------------------------------
# Every generated artifact must match model/conceptual-model.json (ADR-017, NFR-10).
build = subprocess.run([sys.executable, str(ROOT / 'scripts/build.py'), '--check'],
                       capture_output=True, text=True, encoding='utf-8')
assert build.returncode == 0, build.stdout + build.stderr

# --- 2. Ontology parses identically in its three serializations -----------------
model = json.loads(read('model/conceptual-model.json'))
g = Graph().parse(ROOT / 'ontology/src/aro.ttl')
for fmt, path in (('xml', 'ontology/src/aro.owl'), ('json-ld', 'ontology/src/aro.jsonld')):
    assert len(Graph().parse(ROOT / path, format=fmt)) == len(g), path

# --- 3. Catalog integrity ----------------------------------------------------------
names = [c['name'] for c in model['classes']]
assert len(names) == len(set(names)), 'duplicate class names'
# every catalog class and relation exists in the OWL projection
for c in names:
    assert (ns[c], RDF.type, OWL.Class) in g, c
for r in model['relations']:
    assert (ns[r['name']], RDF.type, OWL.ObjectProperty) in g, r['name']
# packages and specializations refer to existing entries
packages = {p['name'] for p in model['packages']}
for c in model['classes']:
    assert c['package'] in packages, c['name']
    assert c.get('specializes') in (None, *names), c['name']
# relation ends are ARO classes or prefixed external classes (e.g. oa:Selector)
for r in model['relations']:
    for end in ('source', 'target'):
        for x in ([r[end]] if isinstance(r[end], str) else r[end]):
            assert x in names or ':' in x, (r['name'], x)
# concept names share the aro: namespace with classes, so they must not collide
concepts = [k['name'] for s in model.get('concept_schemes', []) for k in s['concepts']]
assert len(set(concepts + names)) == len(concepts) + len(names), 'concept/class name clash'
# skos:broader must point to a concept of the same scheme
for s in model.get('concept_schemes', []):
    for k in s['concepts']:
        assert k.get('broader') in (None, *(x['name'] for x in s['concepts'])), k['name']

# --- 4. Language policy (ADR-024) -----------------------------------------------
# Terms are identified in English and every term is labelled, defined and commented
# in both en and pt-BR; no other language appears inside the ontology itself.


def langs(subject, predicate):
    """Language tags of the literals attached to subject via predicate."""
    return {o.language for o in g.objects(subject, predicate) if isinstance(o, Literal)}


def aro_terms(*types):
    """ARO-namespace subjects having any of the given rdf:types."""
    found = set()
    for t in types:
        found |= set(g.subjects(RDF.type, t))
    return {s for s in found if str(s).startswith(str(ns))}


for s in aro_terms(OWL.Class, OWL.ObjectProperty, OWL.DatatypeProperty):
    assert {'en', 'pt-BR'} <= langs(s, RDFS.label), s
for s in aro_terms(OWL.Class, OWL.DatatypeProperty):
    assert {'en', 'pt-BR'} <= langs(s, RDFS.comment), s
for s in aro_terms(OWL.Class, SKOS.Concept):
    assert {'en', 'pt-BR'} <= langs(s, SKOS.definition), s
for s in aro_terms(SKOS.Concept):
    assert {'en', 'pt-BR'} <= langs(s, SKOS.prefLabel), s
for o in g.objects(None, None):
    if isinstance(o, Literal) and o.language:
        assert o.language in ('en', 'pt-BR'), o

# --- 5. JSON Schemas and their examples -----------------------------------------
sh = Graph().parse(ROOT / 'validation/aro-shapes.ttl')
assert len(sh) > 20
# reference sources and generic records
schema = json.loads(read('schemas/reference-source.schema.json'))
Draft202012Validator.check_schema(schema)
Draft202012Validator.check_schema(json.loads(read('schemas/record.schema.json')))
Draft202012Validator(schema, format_checker=FormatChecker()).validate(
    json.loads(read('examples/synthetic-reference-source.json')))
# annotator exchange format: the example must be accepted...
ann_schema = json.loads(read('schemas/derivation-annotation.schema.json'))
Draft202012Validator.check_schema(ann_schema)
ann = Draft202012Validator(ann_schema, format_checker=FormatChecker())
ann_example = json.loads(read('examples/synthetic-derivation-annotation.json'))
ann.validate(ann_example)
# ...while a Selection anchor without selector, a type outside the vocabulary
# ("Plagiarism" was renamed) and an unknown dimension must all be rejected
bad_ann = {'id': 'x', 'type': 'DerivationAnnotation',
           'source': {'level': 'Selection', 'target': 's'}, 'derived': {'level': 'Artwork', 'target': 'd'},
           'derivationTypes': ['Plagiarism'], 'aspects': [{'dimension': 'Smell', 'operation': 'Retained'}],
           'annotator': 'https://example.org/a', 'createdAt': '2026-10-30T12:00:00Z'}
assert len(list(ann.iter_errors(bad_ann))) >= 3
# multilingual texts must be keyed by valid BCP 47 language tags
assert list(ann.iter_errors({**ann_example, 'justification': {'not a tag!': 'x'}}))

# --- 6. SHACL ---------------------------------------------------------------------
# Every example file must conform on its own (RDFS inference lets external agents be
# recognised as CreativeAgent/Analyst through property ranges). Files are validated
# separately because a revised copy may reuse the IRIs of the file it revises.
# synthetic-derivation.ttl reuses the pattern defined in synthetic-data.ttl
DEPENDS_ON = {'synthetic-derivation.ttl': ['synthetic-data.ttl']}
for example in sorted((ROOT / 'examples').glob('*.ttl')):
    data = Graph().parse(example)
    for extra in DEPENDS_ON.get(example.name, []):
        data.parse(ROOT / 'examples' / extra)
    conforms, _, report = validate(data, shacl_graph=sh, ont_graph=g,
                                   inference='rdfs', advanced=True)
    assert conforms, f'{example.name}:\n{report}'
# Synthetic examples merged: input of the competency-question probes below
instances = Graph()
for name in ('synthetic-data.ttl', 'synthetic-derivation.ttl', 'quickstart.ttl', 'case-studies.ttl'):
    instances.parse(ROOT / 'examples' / name)
# Negative test: a claim deriving a non-artistic resource from itself, with no
# derivation type and untagged text, must violate several constraints
bad = Graph().parse(data='''@prefix aro: <https://w3id.org/aro/ontology#> . @prefix ex: <https://example.org/bad/> .
ex:claim a aro:DerivationClaim ; aro:hasSourceAnchor ex:x ; aro:hasDerivedAnchor ex:x .
ex:x a aro:ReferenceSource ; aro:textValue "untagged text" .''', format='turtle')
conforms, results, _ = validate(bad, shacl_graph=sh, ont_graph=g, inference='rdfs', advanced=True)
assert not conforms
messages = ' '.join(str(o) for o in results.objects(None, SH.resultMessage))
assert 'must differ' in messages and 'Artwork, Manifestation or Selection' in messages, messages
# violation messages are reported in both languages
assert 'language-tagged' in messages and 'devem ser diferentes' in messages, messages

# --- 7. Competency questions ----------------------------------------------------
# Each SPARQL probe must return at least one row over the examples plus the ontology
# (the ontology supplies concept labels used by some queries).
for query in sorted((ROOT / 'queries').glob('*.rq')):
    result = list((instances + g).query(query.read_text(encoding='utf-8')))
    assert result, f'No results: {query.name}'
    print(f'{query.name}: {len(result)} row(s)')

# --- 8. Case studies ------------------------------------------------------------------
# The research-question queries must give the expected answers on examples/case-studies.ttl.
cases = Graph().parse(ROOT / 'examples/case-studies.ttl') + g


def run(name):
    return list(cases.query(read(f'queries/{name}')))


rq1_works = {str(r.work) for r in run('RQ-01-passages-to-real-cases.rq')}
assert {'Homem na Estrada (Man on the Road)', 'Vidas Secas (Barren Lives)'} <= rq1_works, rq1_works
rq2 = run('RQ-02-recurring-patterns.rq')
assert any(str(r.pattern).startswith('Arbitrary or lethal violence') and int(r.works) == 2 for r in rq2), rq2
assert all(str(r.sourceURL).startswith('https://') for r in run('RQ-03-evidence-for-correspondences.rq'))
assert any(str(r.derived).startswith('Barren Lives') for r in run('RQ-04-derivations-keeping-real-patterns.rq'))

# Content may be written in any language (ADR-024): the research questions must also answer
# on data written only in Portuguese, with the default preferred language (en) and with pt-BR.
pt_only = Graph()
for s, p, o in Graph().parse(ROOT / 'examples/case-studies.ttl'):
    if not (isinstance(o, Literal) and o.language and o.language.lower() != 'pt-br'):
        pt_only.add((s, p, o))
pt_cases = pt_only + g
for lang in ('en', 'pt-BR'):
    rq1 = read('queries/RQ-01-passages-to-real-cases.rq').replace('VALUES ?lang { "en" }', f'VALUES ?lang {{ "{lang}" }}')
    rows = list(pt_cases.query(rq1))
    assert len(rows) == len(run('RQ-01-passages-to-real-cases.rq')), (lang, len(rows))
    assert all(r.situation.language.lower() == 'pt-br' for r in rows), lang

# Per-work files are up to date and together cover the whole case-studies file
split = subprocess.run([sys.executable, str(ROOT / 'scripts/split_examples.py'), '--check'],
                       capture_output=True, text=True, encoding='utf-8')
assert split.returncode == 0, split.stdout + split.stderr
full = set(Graph().parse(ROOT / 'examples/case-studies.ttl'))
per_work = set()
# only the files produced by scripts/split_examples.py (other example_*.ttl files are researchers' own)
for path in [ROOT / 'examples' / 'example_homem_na_estrada.ttl', ROOT / 'examples' / 'example_vidas_secas.ttl']:
    per_work |= set(Graph().parse(path))
assert full == per_work, f'{len(full - per_work)} triples of case-studies.ttl missing from example_*.ttl'

# --- 9. Releases --------------------------------------------------------------------
# Every frozen version is complete, parses in its three formats and declares its own
# version; the development ontology points to its version IRI.
releases = sorted((ROOT / 'releases').glob('v*/'))
assert releases, 'no releases found'
for rel in releases:
    for name in ('aro.ttl', 'aro.owl', 'aro.jsonld', 'aro-shapes.ttl', 'RELEASE-NOTES.md'):
        assert (rel / name).exists(), f'{rel.name}/{name} missing'
    rg = Graph().parse(rel / 'aro.ttl')
    for fmt, name in (('xml', 'aro.owl'), ('json-ld', 'aro.jsonld')):
        assert len(Graph().parse(rel / name, format=fmt)) == len(rg), f'{rel.name}/{name}'
    assert str(next(rg.objects(None, OWL.versionInfo))) == rel.name[1:], f'{rel.name}: owl:versionInfo differs'
current = model['version']
version_iris = [str(o) for o in g.objects(None, OWL.versionIRI)]
assert version_iris and version_iris[0].endswith('/' + current), 'owl:versionIRI missing or wrong'

print(f'PASS: build up to date, {len(names)} classes, {len(model["relations"])} relations; '
      'ontology, SHACL conformance, JSON Schema and SPARQL probes')
