async function checkLink() {
    const url = document.getElementById("urlInput").value;
    const resultDiv = document.getElementById("result");

    if (!url) {
        resultDiv.innerHTML = "⚠️ Enter URL";
        return;
    }

    const apiKey = "YOUR_API_KEY";

    try {
        // Submit URL
        const res = await fetch("https://www.virustotal.com/api/v3/urls", {
            method: "POST",
            headers: {
                "x-apikey": apiKey,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "url=" + encodeURIComponent(url)
        });

        const data = await res.json();
        const id = data.data.id;

        // ⏳ WAIT (IMPORTANT)
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Get report
        const report = await fetch(`https://www.virustotal.com/api/v3/analyses/${id}`, {
            headers: { "x-apikey": apiKey }
        });

        const result = await report.json();
        const stats = result.data.attributes.stats;

        if (stats.malicious > 0 || stats.suspicious > 0) {
            resultDiv.innerHTML = "❌ Dangerous Link";
        } else {
            resultDiv.innerHTML = "✅ Safe Link";
        }

    } catch (err) {
        resultDiv.innerHTML = "❌ API Error";
        console.error(err);
    }
}