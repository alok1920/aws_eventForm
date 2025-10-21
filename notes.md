Project 01: Serverless Project

In this project we will create a Event Registration Form.

The user will provide all the details, after the user click-on register the script will collect the data and validate the data, the code will store it in database.

As a cloud engineer you need to setup the infrastructure for this project.We need to use some services for project.

**Services Used:**

*   **Database Setup:** we need to setup database thre are many types of data base like RDBMS, DynamoDB, etc. The database t setup instruction is given by developer.In this project we are using DynamoDB.
    
*   **Lambda:** The Code that collects, validate and store the we will run it into Lambda. As we want to run the program when the user click-on the registration form.We cannot use EC2 here as we need to keep the EC2 running even when the user is not filling the form as it will increase the cost.
    
*   **API Gateway:** To connect frontend with backend we need to use this service.
    
*   **SNS Service:** After the registration we need to send the notification to user for that we use this service. The notification will be sent when data is successfully added to database.
    

Database Setup
--------------

PROJECT 01: Dynamo DB stores data in key value pair.

**Registration form** fields:

*   eventID
    
*   customerName
    
*   customerAge
    
*   eventName
    

These are the values that will be stored in database. so we are using Dynamo DB.

**To create table in DynamoDB:**

1.  Go to DynamoDB
    
2.  Create table.
    
3.  Name of database: eventsDB
    
4.  Partition Key: eventID
    
    *   it a key which normally contains unique values. example eventID
        
5.  Sort Key (Optional):
    
    *   its a second primary key, if the roll number of students will be same for different class student. so we will be using this key.
        
6.  Table Settings: Default
    
7.  create table
    

**Breakdown:**

*   **Partition Key (eventID):** Unique identifier for each record.
    
*   **Sort Key (Optional):** Secondary identifier when needed.
    
*   **Table Settings:** Default options suitable for most cases.
    

Note:- If one AWS service wants to have the permission to communicate with another AWS service then we create IAM Role.

Creating IAM Role
-----------------

*   Go to IAM
    
*   Click on Roles.
    
*   Create Roles.
    
*   Trusted Entity Type: AWS Service
    
*   Use Case: Lambda
    
*   Permission Policies: AmazonDynamoDBFullAccess
    
*   Role Name: AmazonLambda\_DB
    
*   create roles
    

Attaching role to Lambda
------------------------

*   Go to Lambda
    
*   Create functions.
    
*   Function Name: EventManagementFunction
    
*   Runetime: Python
    
*   Change default execution roles: AmazonLambda\_DB
    
*   Here we are attaching the IAM role.
    
*   create function
    

**EventManagementFunction you need to write the following lambda function.**

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Create a DynamoDB resource object using the boto3 library.  # It automatically connects to the DynamoDB endpoint in the same region  # as the Lambda function.  MyDynamoDB = boto3.resource('dynamodb')  # Select the specific DynamoDB table to interact with.  # The table name 'eventsDB' must exist in the correct region.  MyTable = MyDynamoDB.Table('eventsDB')  # Put a new item into the DynamoDB table.  MyTable.put_item(      Item={          # The 'Item' parameter is a dictionary containing the data to be stored.          # The key 'eventID' is the partition key for the 'eventsDB' table.          # It must be spelled correctly and match the table's schema,          # which is why it was changed from 'eventId' to 'eventID' in a previous step.          'eventID': event_id,          'eventName': event_name,          'customerName': customer_name,          'customerAge': customer_age      },      # The 'ConditionExpression' ensures that the item is only written if      # an item with the same partition key does not already exist.      # This prevents overwriting existing data.      ConditionExpression='attribute_not_exists(eventID)'  )   `

**Breakdown:**

*   **Resource Initialization:** boto3.resource('dynamodb') creates the DynamoDB interface.
    
*   **Table Reference:** MyDynamoDB.Table('eventsDB') points to the eventsDB table.
    
*   **Conditional Write:** ConditionExpression='attribute\_not\_exists(eventID)' prevents overwrites.
    

After pasting the code click Deploy, this will save the code. You can create test and you can create new test cases for testing.

**Use following code example for testing.**

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "eventId": 200,    "eventName": "Swimming",    "customerName": "Raju" ,    "customerAge": 30  }   `

**Breakdown:**

*   **Event Payload:** Keys match the Lambda handler's expected fields.
    
*   **Value Types:** Ensure correct data types (e.g., numbers vs. strings).
    

When you run the test you can see the data in the DynamoDB table.

API Gateway Setup
-----------------

Now we need to connect frontend with the backend using API Gateway. We will setup in such a way in API Gateway where /register is invoke the Lambda Function starts working.

1.  Go to API Gateway
    
2.  Create API
    
3.  Select RestAPI
    
4.  Create RestAPI
    
5.  New API
    
6.  API name: RegestrationEndPoint
    
7.  Create API
    
8.  In **Resources**, create resource
    
    *   Resource path: /
        
    *   Resource name: register
        
    *   Enable CORS
        
    *   create Resource
        
9.  Select /register resource, then:
    
    *   Create Method
        
    *   Method Type: POST (as we are inserting the data)
        
    *   Integration Type: Lambda
        
    *   Lambda Function: Select region and function
        
    *   create method
        
10.  Click Deploy API.
    

Frontend Integration (JavaScript)
---------------------------------

To fetch the data from the form and send it to API Gateway, first get the invoke URL from **API Gateway > Stages > /developer/register**, e.g.:

https://059o82cea0.execute-api.ap-south-1.amazonaws.com/development/register

Use the fetch() function in JavaScript:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML``   const MyForm = document.querySelector("form");  MyForm.addEventListener("submit", async function(e) {      e.preventDefault();      const fetchedEventID = e.target[0].value;      const fetchedEventName = e.target[1].value;      const fetchedCustomerName = e.target[2].value;      const fetchedCustomerAge = e.target[3].value;      const fetchedCustomerEmail = e.target[4].value;      try {          const response = await fetch("https://059o82cea0.execute-api.ap-south-1.amazonaws.com/development/register", {              method: "POST",              headers: {                  "Content-Type": "application/json"              },              body: JSON.stringify({                  eid: fetchedEventID,                  ename: fetchedEventName,                  cname: fetchedCustomerName,                  cage: fetchedCustomerAge,                  cemail: fetchedCustomerEmail              })          });          if (!response.ok) {              throw new Error(`HTTP error! status: ${response.status}`);          }          const result = await response.json();          console.log("Success:", result);          alert("Registration successful!");      } catch (error) {          console.error("Fetch error:", error);          alert("Something went wrong. Check console for details.");      }  });   ``

**Breakdown:**

*   **Form Selection:** document.querySelector("form") grabs the form element.
    
*   **Submit Listener:** Handles the submit event and prevents page reload.
    
*   **Input Retrieval:** Accesses each field via e.target\[index\].value.
    
*   **fetch Call:** Sends a POST request with a JSON payload.
    
*   **Response Handling:** Checks status, parses JSON, alerts user.
    

Challenges & Solutions
----------------------

**Error:**An error occurred (ValidationException) when calling the PutItem operation: One or more parameter values were invalid: Type mismatch for key eventID expected: N actual: S

**Solution:**Perfect — that one line fix explains everything ✅**Reason (short and clear):** Your DynamoDB table key eventID is defined as a Number (N).When the form submitted data from your webpage, all inputs came in as strings (e.g. "123"). So your Lambda tried to insert a string into a Number key → DynamoDB threw:“Type mismatch for key eventID expected: N actual: S”By converting it:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   event_id = int(event['eid'])   `

you changed "123" → 123 (a true integer). Now DynamoDB sees it as Number (N) and accepts it.👉 In short: form inputs are always strings; DynamoDB key expected a number. Converting fixed the type mismatch.

**Full Lambda handler snippet:**

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   import json  import boto3  def lambda_handler(event, context):      print(event)      event_id = int(event['eid'])      event_name = event['ename']      customer_name = event['cname']      customer_age = event['cage']      customer_email = event['cemail']      MyDynamoDB = boto3.resource('dynamodb')      MyTable = MyDynamoDB.Table('eventsDB')      MyTable.put_item(          Item={              # Change the key name from 'eventId' to 'eventID' to match the table's partition key              'eventID': event_id,              'eventName': event_name,              'customerName': customer_name,              'customerAge': customer_age,              'customerEmail': customer_email          },          ConditionExpression='attribute_not_exists(eventID)'      )   `

**Breakdown:**

*   **Imports:** import json for handling JSON payloads, import boto3 for AWS SDK.
    
*   **Handler Definition:** def lambda\_handler(event, context): main entry point.
    
*   **Logging:** print(event) outputs the event payload to CloudWatch.
    
*   **Data Extraction & Conversion:**
    
    *   event\_id = int(event\['eid'\]) converts the string input to an integer for the eventID partition key.
        
    *   event\_name = event\['ename'\], customer\_name = event\['cname'\], customer\_age = event\['cage'\], customer\_email = event\['cemail'\] map form fields to variables.
        
*   **DynamoDB Setup:** boto3.resource('dynamodb') and .Table('eventsDB') initialize the table object.
    
*   MyTable.put\_item( Item={ ... }, ConditionExpression='attribute\_not\_exists(eventID)')Ensures the item is only inserted if eventID doesn’t already exist.