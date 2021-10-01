#!/usr/bin/env bash
GITROOT="$(git rev-parse --show-toplevel)"

# PUPD pages
cd "$GITROOT/pages" || exit 2
xargs -n 1 curl -O < "$GITROOT/urls.txt"
# Purdue Emergency Alerts Page
curl https://www.purdue.edu/emergency/ -o emergency.html
curl https://www.purdue.edu/emergency/news/News.php -o emergency-news.html

# Daily Crime Logs
cd "$GITROOT/daily-crime-log-archives" || exit 2
wget --random-wait https://www.purdue.edu/ehps/police/statistics-policies/daily-crime-log-archives/index.php -r -D www.purdue.edu -I ehps/police/statistics-policies/daily-crime-log-archives || true

# Timely Warnings
cd "$GITROOT/timely-warnings" || exit 2
wget --random-wait https://www.purdue.edu/timely-warnings/ -r -D www.purdue.edu -I timely-warnings || true
