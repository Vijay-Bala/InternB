from flask import Flask, render_template, request
from nltk import ngrams
import nltk
nltk.download('punkt')

app = Flask(__name__)

def generate_ngrams(text, n):
    words = nltk.word_tokenize(text)
    return set(ngrams(words, n))

def calculate_similarity(ngrams1, ngrams2):
    ngrams1 = list(ngrams1)
    ngrams2 = list(ngrams2)

    #calc Jaccard similarity
    intersection = len(set(ngrams1).intersection(ngrams2))
    union = len(set(ngrams1).union(ngrams2))

    if union == 0:
        return 0.0

    similarity = intersection / union
    return similarity * 100

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/compare', methods=['POST'])
def compare():
    sentence1 = request.form['sentence1']
    sentence2 = request.form['sentence2']
    ngram_size = 2  
    ngrams1 = generate_ngrams(sentence1, ngram_size)
    ngrams2 = generate_ngrams(sentence2, ngram_size)
    similarity = calculate_similarity(ngrams1, ngrams2)

    return f'Similarity: {similarity:.2f}%'

if __name__ == '__main__':
    app.run(debug=True)
