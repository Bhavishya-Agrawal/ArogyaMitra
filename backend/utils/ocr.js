const createClient = require("@azure-rest/ai-vision-image-analysis").default;
const { AzureKeyCredential } = require("@azure/core-auth");
const fs = require("fs");
require("dotenv").config();

const endpoint = process.env.VISION_ENDPOINT;
const key = process.env.VISION_KEY;

const client = createClient(endpoint, new AzureKeyCredential(key));

const imagePath = "FTmuxpAWAAAhltA.jpg";  

const features = ["Read"];

// BILL AMOUNT EXTRACTION FUNCTION
function extractBillAmount(textLines) {
  const patterns = [
    /grand\s*total\s*[:\-]?\s*([\₹\$\€]?\s*[\d,]*\.?\d+)/i,
    /Grand\s*Total\s*[:\-]?\s*([\₹\$\€]?\s*[\d,]*\.?\d+)/,
    /total\s*amount\s*[:\-]?\s*([\₹\$\€]?\s*[\d,]*\.?\d+)/i,
    /total\s*due\s*[:\-]?\s*([\₹\$\€]?\s*[\d,]*\.?\d+)/i,
    /amount\s*due\s*[:\-]?\s*([\₹\$\€]?\s*[\d,]*\.?\d+)/i,
    /balance\s*due\s*[:\-]?\s*([\₹\$\€]?\s*[\d,]*\.?\d+)/i,
    /amount\s*[:\-]?\s*([\₹\$\€]?\s*[\d,]*\.?\d+)/i,
    /total\s*[:\-]?\s*([\₹\$\€]?\s*[\d,]*\.?\d+)/i,
    /PayOnline\s*[:\-]?\s*([\₹\$\€]?\s*[\d,]*\.?\d+)/i,
    /In\s*words\s*[:\-]?\s*([\₹\$\€]?\s*[\d,]*\.?\d+)/i,
    /bill\s*amount\s*[:\-]?\s*([\₹\$\€]?\s*[\d,]*\.?\d+)/i,
    /grand\s*total\s*[:\-]?\s*([\d,]+\.\d+)/i,
    /bill\s*amount\s*[:\-]?\s*([\d,]+\.\d+)/i,
    /net\s*amount\s*to\s*be\s*paid.*?[:\-]?\s*([\d,]+\.\d+)/i,
    /total\s*deposit\s*amount\s*[:\-]?\s*([\d,]+\.\d+)/i,
    /deposit\s*[:\-]?\s*([\d,]+\.\d+)/i
  ];

  for (const line of textLines) {
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        return match[1].replace(/[, ]/g, ""); 
      }
    }
  }

  return null;
}

async function analyzeImage() {
  try {
    const imageBuffer = fs.readFileSync(imagePath);

    const result = await client.path("/imageanalysis:analyze").post({
      body: imageBuffer,
      contentType: "application/octet-stream",
      queryParameters: { features: features }
    });

    const iaResult = result.body;

    if (!iaResult.readResult || !iaResult.readResult.blocks) {
      console.log("No text found in the image.");
      return;
    }

    const lines = [];

    console.log("\n---- OCR TEXT ----");
    iaResult.readResult.blocks.forEach(block => {
      block.lines.forEach(line => {
        console.log(line.text);
        lines.push(line.text);
      });
    });

    const amount = extractBillAmount(lines);

    console.log("\n---- BILL AMOUNT ----");
    console.log(amount ? amount : "No amount detected.");

  } catch (err) {
    console.error("Error:", err);
  }
}

analyzeImage();