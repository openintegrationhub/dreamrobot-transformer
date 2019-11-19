/**
 * Copyright 2018 DreamRobot GmbH
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const jsonata = require('jsonata');

module.exports.getExpression = msg => {
  console.log(`My Message: ${JSON.stringify(msg)}`);
  if (Object.keys(msg.body).length === 0 && msg.body.constructor === Object) {
    return msg.body;
  }

  const expression =  jsonata(`{
     "meta": {
      "recordUid": body.meta.recordUid,
      "applicationUid": (body.meta.applicationUid!=undefined and body.meta.applicationUid!=null) ? body.meta.applicationUid : 'appUid not set yet',
      "iamToken": (body.meta.iamToken!=undefined and body.meta.iamToken!=null) ? body.meta.iamToken : 'iamToken not set yet',
      "lastModification": {
            "type": 'created or modified',
            "timestamp": body.data.order.date
      },
      "domainId": 'TO BE ADDED',
      "schemaURI": 'TO BE ADDED'
    },
    "data":{
    "invoiceAmount":            $trim(body.data.order.invoice_amount) = "" ? 0 : $number($trim(body.data.order.invoice_amount)),
    "orderNumber":              body.data.order.id,
    "hiddenInfos":              body.data.order.pack_infos,
    "information":              body.data.order.infos,
    "additionalInformation":    body.data.order.customer.comment,
    "billUrl":                  $string(body.data.order.bill_url),
    "paymentMethodName":        body.data.order.payment_method_id,
    "invoiceNumber":            $trim(body.data.order.invoice_number) = "" ? 0 : $number($trim(body.data.order.invoice_number)),
    "paidAmount":               $trim(body.data.order.paid_amount) = "" ? 0 : $number($trim(body.data.order.paid_amount)),
    "currency":                 body.data.order.currency_id,
    "startDate":                body.data.order.date,
    "endDate":                  body.data.order.shipped_date,
    "status": [
      body.data.order.status.is_paid ? {
      "qualifier":              'paid',
      "value":                  $string(body.data.order.status.is_paid),
      "qualifiedOn":            body.data.order.status.paid_date = "0000-00-00" ? undefined : $fromMillis($toMillis( body.data.order.status.paid_date,'[Y0001]-[M01]-[D01]'))
      },body.data.order.status.is_parked ? {
      "qualifier":              'parked',
      "value":                  $string(body.data.order.status.is_parked),
      "qualifiedOn":            undefined
      },body.data.order.status.is_initial_contact ? {
      "qualifier":              'initialContact',
      "value":                  $string(body.data.order.status.is_initial_contact),
      "qualifiedOn":            body.data.order.status.initial_contact_date = "0000-00-00" ? undefined : $fromMillis($toMillis( body.data.order.status.initial_contact_date,'[Y0001]-[M01]-[D01]'))
      },body.data.order.status.is_packed ? {
      "qualifier":              'packed',
      "value":                  $string(body.data.order.status.is_packed),
      "qualifiedOn":            body.data.order.status.packed_date = "0000-00-00" ? undefined : $fromMillis($toMillis( body.data.order.status.packed_date,'[Y0001]-[M01]-[D01]'))
      },body.data.order.status.is_shipped ? {
      "qualifier":              'shipped',
      "value":                  $string(body.data.order.status.is_shipped),
      "qualifiedOn":            body.data.order.status.shipped_date = "0000-00-00" ? undefined : $fromMillis($toMillis( body.data.order.status.shipped_date,'[Y0001]-[M01]-[D01]'))
      },body.data.order.status.is_arrived ? {
      "qualifier":              'arrived',
      "value":                  $string(body.data.order.status.is_arrived),
      "qualifiedOn":            body.data.order.status.arrived_date = "0000-00-00" ? undefined : $fromMillis($toMillis( body.data.order.status.arrived_date,'[Y0001]-[M01]-[D01]'))
      },body.data.order.status.is_cancelled ? {
      "qualifier":              'cancelled',
      "value":                  $string(body.data.order.status.is_cancelled),
      "qualifiedOn":            body.data.order.status.cancelled_date = "0000-00-00" ? undefined : $fromMillis($toMillis( body.data.order.status.cancelled_date,'[Y0001]-[M01]-[D01]'))
      },body.data.order.status.is_checkout ? {
      "qualifier":              'checkout',
      "value":                  $string(body.data.order.status.is_checkout),
      "qualifiedOn":            undefined
      }
    ],
    "references": [
      {
        "externalId":               body.data.order.customer.username,
        "externalApplicationName":  body.data.order.platform,
        "description":              undefined
      },
      {
        "externalId":               body.data.order.id,
        "externalApplicationName":  'DreamRobot',
        "description":              undefined
      }
    ],
    "shipping":
      {
        "fee":                  $trim(body.data.order.shipping.fee) = "" ? 0 : $number($trim(body.data.order.shipping.fee)),
        "feeCurrency":          body.data.order.currency_id,
        "date":                 body.data.order.shipping.date,
        "deliverer":            body.data.order.shipping.deliverer,
        "code":                 body.data.order.shipping.code,
        "method":               body.data.order.shipping.method,
        "address": {
          "street":             body.data.order.shipping.address.street ? $trim($substringBefore( body.data.order.shipping.address.street, $split( body.data.order.shipping.address.street, ' ')[-1])),
          "streetNumber":       body.data.order.shipping.address.street ? $trim($split( body.data.order.shipping.address.street, " ")[-1]),
          "unit":               body.data.order.shipping.address.street_2,
          "zipCode":            body.data.order.shipping.address.zip,
          "city":               body.data.order.shipping.address.city,
          "district":           undefined,
          "region":             body.data.order.shipping.address.province,
          "country":            body.data.order.shipping.address.country,
          "countryCode":        body.data.order.shipping.address.country_iso2,
          "primaryContact":     body.data.order.shipping.address.name & ' ' & body.data.order.shipping.address.name_2 != ' ' ? body.data.order.shipping.address.name & ' ' & body.data.order.shipping.address.name_2,
          "label":              'primary'
        }

      },
      "lineItems":               $map(body.data.order.line, function($value,$index,$a) {
   		{
        	"name": $value.name,
            "sku":  $value.sku,
            "quantity":      $trim($value.quantity) = "" ? 0 : $number($trim($value.quantity)),
            "price":         $trim($value.price) = "" ? 0 : $number($trim($value.price)),
            "taxAmount":     $trim($value.tax) = "" ? 0 : $number($trim($value.tax)),
            "productId":     $value.transaction_id,
            "references": 
              {
                "externalId":               $value.stock_align_id,
                "externalApplicationName":  "dreamrobot_stock_id",
                "description":              undefined
              }            
        }
	}),
    "customer": {
      "title": undefined,
      "salutation": undefined,
      "firstName": body.data.order.customer.address.name ? $trim($substringBefore(body.data.order.customer.address.name, $split(body.data.order.customer.address.name, ' ')[-1])),
      "middleName": undefined,
      "lastName": body.data.order.customer.address.name ? $trim($split(body.data.order.customer.address.name, " ")[-1]),
      "gender": undefined,
      "birthday": undefined,
      "notes": undefined,
      "displayName": body.data.order.customer.address.name,
      "language": undefined,
      "nickname": undefined,
      "jobTitle": undefined,
      "photo": undefined,
      "anniversary": undefined,
      "addresses":[{
          "street":             body.data.order.customer.address.street ?  $trim($substringBefore( body.data.order.customer.address.street, $split( body.data.order.customer.address.street, ' ')[-1])),
          "streetNumber":       body.data.order.customer.address.street ?  $trim($split( body.data.order.customer.address.street, " ")[-1]),
          "unit":               body.data.order.customer.address.street_2,
          "zipCode":            body.data.order.customer.address.zip,
          "city":               body.data.order.customer.address.city,
          "district":           undefined,
          "region":             body.data.order.customer.address.province,
          "country":            body.data.order.customer.address.country,
          "countryCode":        body.data.order.customer.address.country_iso2,
          "primaryContact":     body.data.order.customer.address.name & ' ' & body.data.order.customer.address.name_2 != ' ' ? body.data.order.customer.address.name & ' ' & body.data.order.customer.address.name_2,
          "label":              'primary'
      }],
      "contactData": [body.data.order.customer.address.name_2 ? {
        "value": body.data.order.customer.address.name_2,
        "type": 'name',
        "description": 'Billing Name 2'
      },
        body.data.order.shipping.address.name_2 ? {
          "value": body.data.order.shipping.address.name_2,
          "type": 'name',
          "description": 'Shipping Name 2'
        },
        body.data.order.customer.phone_1 ? {
          "value": body.data.order.customer.phone_1,
          "type": 'phone',
          "description": 'primary'
        },
        body.data.order.customer.phone_2 ? {
          "value": body.data.order.customer.phone_2,
          "type": 'phone',
          "description": 'secondary'
        },
        body.data.order.customer.fax ? {
          "value": body.data.order.customer.fax,
          "type": 'fax',
          "description": 'primary'
        },
        body.data.order.customer.email ? {
          "value": body.data.order.customer.email,
          "type": 'email',
          "description": 'primary'
        }
      ],
      "calendars": [],
      "categories": []
    }
  }}`).evaluate(msg);

  console.log(`OKi Doki: ${JSON.stringify(expression)}`);
  return expression;
};