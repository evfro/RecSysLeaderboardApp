import numpy as np
import pandas as pd
import glob
import operator
from collections import Counter
import os
from polara import RecommenderModel, RecommenderData

userid = 'userid'
itemid = 'movieid'
feedback = 'rating'

min_topk = 1
max_topk = 50



def build_dummy_model(holdout, switch_positive):
    data = RecommenderData(None, userid, itemid, feedback)
    data.verbose = False
    data.prepare_training_only()
    data._test = data._test._replace(holdout=holdout)

    model = RecommenderModel(data)
    model.verbose = False
    model._is_ready = True
    model.switch_positive = switch_positive
    return model


def get_holdout(fp):
    return pd.read_csv(fp, header=0)


def is_valid(arr):
    def has_dups(v): # whether duplicate entries exist in a row
        return np.greater(list(Counter(v).values()), 1).any()

    try:
        valid = not np.apply_along_axis(has_dups, 1, arr).any()
    except:
        valid = False

    return valid


def read_submission(fp):
    try:
        submission = np.load(fp)['arr_0']
    except KeyError:
        submission = np.load(fp)['recs']
    except:
        submission = None
    return submission


def get_scores(switch_positive=4):
    res = []

    holdout = get_holdout('data/holdout.csv')
    model = build_dummy_model(holdout, switch_positive)

    for fp in glob.glob('submissions/*.npz'):
        name = os.path.splitext(os.path.split(fp)[1])[0]
        submission = read_submission(fp)
        scores = -2
        if is_valid(submission):
            model._recommendations = submission
            try:
                scores = model.evaluate('hits').true_positive
            except:
                scores = -1
        res.append((name, scores))

    res.sort(key=operator.itemgetter(1), reverse=True)
    return res


def get_team_scores(switch_positive=4):
    res_scores = []

    holdout = get_holdout('data/team_holdout.gz')
    model = build_dummy_model(holdout, switch_positive)

    for fp in glob.glob('submissions/team/*.npz'):
        name = os.path.splitext(os.path.split(fp)[1])[0]
        submission = read_submission(fp)
        tpr = []
        fpr = []
        if is_valid(submission):
            model._recommendations = submission
            try:
                for topk in range(min_topk, max_topk+1, 1):
                    all_scores = model.evaluate('relevance', topk=topk)
                    tpr.append(all_scores.recall)
                    fpr.append(all_scores.fallout)
            except:
                pass
        res_scores.append((name, tpr, fpr))
    res_scores.sort(key=operator.itemgetter(2), reverse=True)
    return res_scores


def combine_scores(scores):
    total = []
    for name, tpr, fpr in scores:
        try:
            #score = max([t-f for t, f in zip(tpr, fpr)])
            score = sum([t-f for t, f in zip(tpr, fpr)]) / len(fpr)
        except:
            score = -1
        total.append((name, score))
    total.sort(key=operator.itemgetter(1), reverse=True)
    return total
