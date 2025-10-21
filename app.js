const MyForm = document.querySelector("form");

MyForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const fetchedEventID = e.target[0].value;
    const fetchedEventName = e.target[1].value;
    const fetchedCustomerName = e.target[2].value;
    const fetchedCustomerAge = e.target[3].value;
    const fetchedCustomerEmail = e.target[4].value;

    try {
        const response = await fetch("https://059o82cea0.execute-api.ap-south-1.amazonaws.com/development/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                eid: fetchedEventID,
                ename: fetchedEventName,
                cname: fetchedCustomerName,
                cage: fetchedCustomerAge,
                cemail: fetchedCustomerEmail
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Success:", result);
        alert("Registration successful!");
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Something went wrong. Check console for details.");
    }
});
