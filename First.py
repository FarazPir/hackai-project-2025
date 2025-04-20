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
from werkzeug.utils import secure_filename
from PIL import Image
import pytesseract

# Ensure pytesseract is installed: pip install pytesseract pillow
# Ensure Tesseract-OCR is installed on your system.


# Initialize environment variables
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("The OPENAI_API_KEY environment variable is not set.")

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests

# Global variable to store diary entries
diary_entries = []  # This will hold all diary entries in memory

# Define default route
@app.route("/")
def home():
    return "Welcome to the Chatbot API!"

# Handle favicon.ico requests to suppress errors
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

    # Combine the user's query with the diary entries
    context = "Here are the user's diary entries:\n" + "\n".join(diary_entries)
    full_query = f"{context}\n\nUser's query: {user_query}"

    # Run the query through the QA chain
    try:
        response = qa_chain.run(full_query)
        return jsonify({"reply": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Diary endpoint to save entries
@app.route("/diary", methods=["POST"])
def diary():
    # Get the user's diary entry from the request
    diary_entry = request.json.get("entry")
    if not diary_entry:
        return jsonify({"error": "No diary entry provided"}), 400

    # Save the diary entry in memory
    try:
        diary_entries.append(diary_entry)
        print(f"Diary entry saved: {diary_entry}")
        return jsonify({"message": "Diary entry saved successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to retrieve all diary entries
@app.route("/diary-entries", methods=["GET"])
def get_diary_entries():
    # Return all saved diary entries
    return jsonify({"diary_entries": diary_entries}), 200


UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Create the uploads folder if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/screenshot", methods=["POST"])
def screenshot():
    if "screenshot" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["screenshot"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        # Save the uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)

        # Perform OCR on the image
        image = Image.open(filepath)
        extracted_text = pytesseract.image_to_string(image)

        # Save the extracted text into GPT memory
        diary_entries.append(extracted_text)
        print(f"Extracted text saved: {extracted_text}")

        return jsonify({"message": "Text extracted and saved successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)