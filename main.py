LANGSMITH_TRACING=True
LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
LANGSMITH_API_KEY="<your-api-key>"
LANGSMITH_PROJECT="hackai-project-2025"
OPENAI_API_KEY="<your-openai-api-key>"

from langchain_openai import ChatOpenAI

llm = ChatOpenAI()
llm.invoke("Hello, world!")