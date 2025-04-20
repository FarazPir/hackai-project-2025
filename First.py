import os
from flask import Flask, request, jsonify
from flask_cors import CORS
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
if not openai_api_key:
    raise ValueError("The OPENAI_API_KEY environment variable is not set.")

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

# Define default route
@app.route("/")
def home():
    return "Welcome to the Chatbot API!"

# Handle favicon.ico requests
@app.route("/favicon.ico")
def favicon():
    return "", 204

# Load knowledge source
loader = TextLoader("data/abuse_patterns.txt")  # Ensure this file exists
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

# Chat endpoint
@app.route("/chat", methods=["POST"])
def chat():
    # Get the user's query from the request
    user_query = request.json.get("message")
    if not user_query:
        return jsonify({"error": "No message provided"}), 400

    # Run the query through the QA chain
    try:
        response = qa_chain.run(user_query)
        return jsonify({"reply": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)