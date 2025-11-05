# File: app/services/alert_service.py

from newsapi import NewsApiClient
from app.core.config import settings

try:
    newsapi = NewsApiClient(api_key=settings.NEWS_API_KEY)
except Exception as e:
    print(f"--- ERROR: Failed to initialize News API client: {e} ---")
    newsapi = None

def get_health_alerts():
    """
    Fetches recent health-related news articles for India.
    """
    if not newsapi:
        return "The news alert service is not configured correctly."

    try:
        # Construct a query to search for relevant health emergencies
        query = (
            '(flood OR cyclone OR earthquake OR pandemic OR epidemic OR outbreak OR "waterborne diseases" OR "bird flu") '
            'AND (health OR warning OR advisory OR alert) AND (Odisha OR India)'
        )

        # Fetch the top 3 latest articles from reliable sources
        top_headlines = newsapi.get_everything(
            q=query,
            sources='the-times-of-india,the-hindu',
            language='en',
            sort_by='publishedAt',
            page_size=3
        )

        articles = top_headlines.get('articles', [])
        if not articles:
            return "No major health alerts found in the news for India or Odisha at the moment."

        reply = "Here are the latest health alerts from the news:\n\n"
        for article in articles:
            title = article.get('title')
            url = article.get('url')
            reply += f"🚨 *{title}*\nRead more: {url}\n\n"

        return reply

    except Exception as e:
        # Handle potential API errors (e.g., expired key, rate limits)
        print(f"--- News API Error: {e} ---")
        error_message = str(e)
        if 'apiKey' in error_message:
             return "There is a problem with the News API key."
        return "Sorry, I'm having trouble fetching the latest alerts right now."