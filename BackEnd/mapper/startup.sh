#! /bin/bash

cd site/wwwroot
source venv/bin/activate
python -m pip install requirements.txt
gunicorn --bind=0.0.0.0 --timeout 600 mapper.wsgi