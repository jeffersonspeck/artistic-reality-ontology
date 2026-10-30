"""Serve the repository locally and open the ARO Annotator in the browser.

Usage:
  python scripts/annotator.py [--port 8765] [--no-browser]

The annotator (annotator/index.html) reads ../ontology/src/aro.ttl, ../model/conceptual-model.json
and ../validation/aro-shapes.ttl, so the whole repository is served, not only the annotator
folder. Responses are sent with `Cache-Control: no-store` so that a regenerated ontology is
always picked up. Stop with Ctrl+C.
"""
from __future__ import annotations

import functools
import http.server
import sys
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    """Static file handler that disables browser caching and serves .ttl as Turtle."""

    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      ".ttl": "text/turtle", ".js": "text/javascript", ".json": "application/json"}

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main(argv: list[str]) -> int:
    port = int(argv[argv.index("--port") + 1]) if "--port" in argv else 8765
    handler = functools.partial(NoCacheHandler, directory=str(ROOT))
    with http.server.ThreadingHTTPServer(("127.0.0.1", port), handler) as server:
        url = f"http://localhost:{port}/annotator/"
        print(f"ARO Annotator: {url}  (Ctrl+C to stop)")
        if "--no-browser" not in argv:
            webbrowser.open(url)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
