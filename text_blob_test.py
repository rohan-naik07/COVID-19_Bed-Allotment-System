from textblob import TextBlob

blob = TextBlob("The beer is good. But the hangover is horrible.", classifier=cl)
blob.classify()
