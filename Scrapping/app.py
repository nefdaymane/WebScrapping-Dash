from flask import Flask, jsonify
from flask_cors import CORS
import bs4
import requests
from textblob import TextBlob
from pymongo import MongoClient
from bson import json_util
import json
from bson import ObjectId

app = Flask(__name__)
CORS(app)

client = MongoClient('localhost', 27017)
db = client['MatinScrapping']
collection = db['matin']

base_url = 'https://lematin.ma/derniere-heure?page='

def jsonify_mongo(data):
    return jsonify(json.loads(json_util.dumps(data)))

@app.route('/scrape', methods=['GET'])
def scrape_and_analyze():
    result = []
    for page_number in range(1, 31):
        url = base_url + str(page_number)
        source = requests.get(url).text
        soup = bs4.BeautifulSoup(source, 'lxml')
        articles = soup.find_all("div", {'class': 'article-info'})

        for i in range(len(articles)):
            articles_title = articles[i].find("a", {'class': 'article-title'}).text.strip()
            articles_text = articles[i].find("a", {'class': 'article-body'}).text.strip()

            # Analyse de sentiments
            blob = TextBlob(articles_text)
            sentiment = "Positive" if blob.sentiment.polarity > 0 else "Negative" if blob.sentiment.polarity < 0 else "Neutral"

            article_data = {
                "title": articles_title,
                "text": articles_text,
                "sentiment": sentiment
            }
            collection.insert_one(article_data)
            result.append(article_data)

    return jsonify_mongo({"result": result})




if __name__ == '__main__':
    app.run(debug=True)
