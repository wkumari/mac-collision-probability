# Simple makefile for deploying to App Engine

DEFAULT: ;

test:
	dev_appserver.py .

deploy: *
	gcloud app deploy