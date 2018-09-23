"""
This script runs the application using a development server.
It contains the definition of routes and views for the application.
"""

import os
import sys
from bottle import default_app, redirect, request, route, template, static_file
from analyze import get_scores, get_team_scores, combine_scores

if '--debug' in sys.argv[1:] or 'SERVER_DEBUG' in os.environ:
    # Debug mode will enable more verbose output in the console window.
    # It must be set at the beginning of the script.
    import bottle
    bottle.debug(True)


@route('/')
def welcome():
    redirect('/leaderboard')


@route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='static')

@route('/team/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='static')


@route('/leaderboard', method=['GET'])
def show_results():
    scores_data = get_scores()
    return template('templates/leaderboard', scores=scores_data)

@route('/team/leaderboard', method=['GET'])
def show_team_results():
    scores = get_team_scores()
    total = combine_scores(scores)
    return template('templates/leaderboard_team', scores=scores, total=total)


def process_upload(request, prefix=None):
    upath = '/upload'
    usave = 'submissions'
    redir = '/leaderboard'
    if prefix:
        upath = f'/{prefix}{upath}'
        usave = f'{usave}/{prefix}'
        redir = f'/{prefix}{redir}'
        print(upath, usave, redir)

    if request.method == 'GET':
        return template('templates/file_upload', upath=upath)
    elif request.method == 'POST':
        upload = request.files.get('upload')
        name, ext = os.path.splitext(upload.filename)
        if ext not in ('.npz',):
            return '<h2>File extension not allowed.</h2>'

        upload.save(usave, overwrite=True) # appends upload.filename automatically
        redirect(redir)
    else:
        return '<h2>Invalid request</h2>'


@route('/upload', method=['GET', 'POST'])
def do_upload():
    return process_upload(request)

@route('/<dest>/upload', method=['GET', 'POST'])
def do_team_upload(dest):
    return process_upload(request, prefix=dest)


def wsgi_app():
    """Returns the application to make available through wfastcgi. This is used
    when the site is published to Microsoft Azure."""
    return default_app()

if __name__ == '__main__':
    # Starts a local test server.
    HOST = os.environ.get('SERVER_HOST', 'localhost')
    try:
        PORT = int(os.environ.get('SERVER_PORT', '5555'))
    except ValueError:
        PORT = 5555
    import bottle
    bottle.run(server='wsgiref', host=HOST, port=PORT)
