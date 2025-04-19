# rag_simple.py

import os
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

# Load your knowledge source (could be any .txt file)
loader = TextLoader("data/abuse_patterns.txt")  # You create this file
documents = loader.load()

# Split the text into chunks
text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
docs = text_splitter.split_documents(documents)

# Create vector store from text chunks
embedding = OpenAIEmbeddings(openai_api_key=openai_api_key)
db = FAISS.from_documents(docs, embedding)

# Set up the retriever + LLM
retriever = db.as_retriever()
llm = OpenAI(openai_api_key=openai_api_key)

qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

# Ask a question
query = "What are early signs of coercive control in a relationship?"
result = qa_chain.run(query)

print(f"\n🧠 Answer:\n{result}")
