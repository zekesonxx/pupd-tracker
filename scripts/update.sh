#!/usr/bin/env bash
GITROOT="$(git rev-parse --show-toplevel)"

# PUPD pages
cd "$GITROOT/pages" || exit 2
xargs -n 1 curl -O < "$GITROOT/urls.txt"

# Timely Warnings
cd "$GITROOT/timely-warnings" || exit 2
wget --random-wait https://www.purdue.edu/timely-warnings/ -r -D www.purdue.edu -I timely-warnings
