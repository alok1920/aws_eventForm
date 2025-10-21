import json
import boto3

def lambda_handler(event, context):
    print(event)
    event_id = int(event['eid'])
    event_name = event['ename']
    customer_name = event['cname']
    customer_age = event['cage']
    customer_email = event['cemail']
    
    MyDynamoDB = boto3.resource('dynamodb')
    MyTable = MyDynamoDB.Table('eventsDB')

    MyTable.put_item(
        Item={
            # Change the key name from 'eventId' to 'eventID' to match the table's partition key
            'eventID': event_id,
            'eventName': event_name,
            'customerName': customer_name,
            'customerAge': customer_age,
            'customerEmail': customer_email
        },
        ConditionExpression='attribute_not_exists(eventID)'
    )
