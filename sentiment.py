import pandas as pd
import tensorflow as tensorflow
import sys,json
lines = sys.stdin.readlines()
comments=json.loads(lines[0])

df = pd.read_csv("Tweets.csv")
review_df = df[['text','airline_sentiment']]

review_df = review_df[review_df['airline_sentiment'] != 'neutral']
#print(review_df["airline_sentiment"].value_counts())

sentiment_label = review_df.airline_sentiment.factorize()

tweet = review_df.text.values
#print(tweet)

tokenizer=tensorflow.keras.preprocessing.text.Tokenizer(num_words=5000)
tokenizer.fit_on_texts(tweet)


model_from_json=tensorflow.keras.models.model_from_json
pad_sequences=tensorflow.keras.preprocessing.sequence.pad_sequences
# Import our model
json_file = open('model.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
loaded_model = model_from_json(loaded_model_json)
loaded_model.load_weights("model.h5")
   
def predict_sentiment(text):
    tw = tokenizer.texts_to_sequences([text])
    tw = pad_sequences(tw,maxlen=200)
    sentiment_label=['Positive', 'Negative']
    prediction = int(loaded_model.predict(tw).round().item())
    print("Predicted Label: ", sentiment_label[prediction])
test_sentence1 = "I enjoyed my journey on this flight.Bad Article.Good Post mate.Pathetic journalism. Awesome work"
predict_sentiment(comments)
