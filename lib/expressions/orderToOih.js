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
  if (Object.keys(msg.body).length === 0 && msg.body.constructor === Object) {
    return msg.body;
  }

  const expression =  jsonata(`{
    "oihApplicationRecords": [{
      "recordUid": body.order.id,
		"lastModification": {
      		"type": 'created or modified',
			"timestamp": body.order.date
		}
    }],
    "invoiceAmount":            $trim(body.order.invoice_amount) = "" ? 0 : $number($trim(body.order.invoice_amount)),
    "orderNumber":              body.order.id,
    "hiddenInfos":              body.order.pack_infos,
    "information":              body.order.infos,
    "additionalInformation":    body.order.customer.comment,
    "billUrl":                  $string(body.order.bill_url),
    "paymentMethodName":        body.order.payment_method_id,
    "invoiceNumber":            $trim(body.order.invoice_number) = "" ? 0 : $number($trim(body.order.invoice_number)),
    "paidAmount":               $trim(body.order.paid_amount) = "" ? 0 : $number($trim(body.order.paid_amount)),
    "currency":                 body.order.currency_id,
    "startDate":                body.order.date,
    "endDate":                  body.order.shipped_date,
    "status": [
      body.order.status.is_paid ? {
      "qualifier":              'paid',
      "value":                  $string(body.order.status.is_paid),
      "qualifiedOn":            body.order.status.paid_date = "0000-00-00" ? undefined : $fromMillis($toMillis( body.order.status.paid_date,'[Y0001]-[M01]-[D01]'))
      },body.order.status.is_parked ? {
      "qualifier":              'parked',
      "value":                  $string(body.order.status.is_parked),
      "qualifiedOn":            undefined
      },body.order.status.is_initial_contact ? {
      "qualifier":              'initialContact',
      "value":                  $string(body.order.status.is_initial_contact),
      "qualifiedOn":            body.order.status.initial_contact_date = "0000-00-00" ? undefined : $fromMillis($toMillis( body.order.status.initial_contact_date,'[Y0001]-[M01]-[D01]'))
      },body.order.status.is_packed ? {
      "qualifier":              'packed',
      "value":                  $string(body.order.status.is_packed),
      "qualifiedOn":            body.order.status.packed_date = "0000-00-00" ? undefined : $fromMillis($toMillis( body.order.status.packed_date,'[Y0001]-[M01]-[D01]'))
      },body.order.status.is_shipped ? {
      "qualifier":              'shipped',
      "value":                  $string(body.order.status.is_shipped),
      "qualifiedOn":            body.order.status.shipped_date = "0000-00-00" ? undefined : $fromMillis($toMillis( body.order.status.shipped_date,'[Y0001]-[M01]-[D01]'))
      },body.order.status.is_arrived ? {
      "qualifier":              'arrived',
      "value":                  $string(body.order.status.is_arrived),
      "qualifiedOn":            body.order.status.arrived_date = "0000-00-00" ? undefined : $fromMillis($toMillis( body.order.status.arrived_date,'[Y0001]-[M01]-[D01]'))
      },body.order.status.is_cancelled ? {
      "qualifier":              'cancelled',
      "value":                  $string(body.order.status.is_cancelled),
      "qualifiedOn":            body.order.status.cancelled_date = "0000-00-00" ? undefined : $fromMillis($toMillis( body.order.status.cancelled_date,'[Y0001]-[M01]-[D01]'))
      },body.order.status.is_checkout ? {
      "qualifier":              'checkout',
      "value":                  $string(body.order.status.is_checkout),
      "qualifiedOn":            undefined
      }
    ],
    "references": [
      {
        "externalId":               body.order.customer.username,
        "externalApplicationName":  body.order.platform,
        "description":              undefined
      },
      {
        "externalId":               body.order.id,
        "externalApplicationName":  'DreamRobot',
        "description":              undefined
      }
    ],
    "shipping":
      {
        "fee":                  $trim(body.order.shipping.fee) = "" ? 0 : $number($trim(body.order.shipping.fee)),
        "feeCurrency":          body.order.currency_id,
        "date":                 body.order.shipping.date,
        "deliverer":            body.order.shipping.deliverer,
        "code":                 body.order.shipping.code,
        "method":               body.order.shipping.method,
        "address": {
          "street":             body.order.shipping.address.street ? $trim($substringBefore( body.order.shipping.address.street, $split( body.order.shipping.address.street, ' ')[-1])),
          "streetNumber":       body.order.shipping.address.street ? $trim($split( body.order.shipping.address.street, " ")[-1]),
          "unit":               body.order.shipping.address.street_2,
          "zipCode":            body.order.shipping.address.zip,
          "city":               body.order.shipping.address.city,
          "district":           undefined,
          "region":             body.order.shipping.address.province,
          "country":            body.order.shipping.address.country,
          "countryCode":        body.order.shipping.address.country_iso2,
          "primaryContact":     body.order.shipping.address.name & ' ' & body.order.shipping.address.name_2 != ' ' ? body.order.shipping.address.name & ' ' & body.order.shipping.address.name_2,
          "label":              'primary'
        }

      },
      "lineItems":               $map(body.order.line, function($value,$index,$a) {
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
      "firstName": body.order.customer.address.name ? $trim($substringBefore(body.order.customer.address.name, $split(body.order.customer.address.name, ' ')[-1])),
      "middleName": undefined,
      "lastName": body.order.customer.address.name ? $trim($split(body.order.customer.address.name, " ")[-1]),
      "gender": undefined,
      "birthday": undefined,
      "notes": undefined,
      "displayName": body.order.customer.address.name,
      "language": undefined,
      "nickname": undefined,
      "jobTitle": undefined,
      "photo": undefined,
      "anniversary": undefined,
      "addresses":[{
          "street":             body.order.customer.address.street ?  $trim($substringBefore( body.order.customer.address.street, $split( body.order.customer.address.street, ' ')[-1])),
          "streetNumber":       body.order.customer.address.street ?  $trim($split( body.order.customer.address.street, " ")[-1]),
          "unit":               body.order.customer.address.street_2,
          "zipCode":            body.order.customer.address.zip,
          "city":               body.order.customer.address.city,
          "district":           undefined,
          "region":             body.order.customer.address.province,
          "country":            body.order.customer.address.country,
          "countryCode":        body.order.customer.address.country_iso2,
          "primaryContact":     body.order.customer.address.name & ' ' & body.order.customer.address.name_2 != ' ' ? body.order.customer.address.name & ' ' & body.order.customer.address.name_2,
          "label":              'primary'
      }],
      "contactData": [body.order.customer.address.name_2 ? {
        "value": body.order.customer.address.name_2,
        "type": 'name',
        "description": 'Billing Name 2'
      },
        body.order.shipping.address.name_2 ? {
          "value": body.order.shipping.address.name_2,
          "type": 'name',
          "description": 'Shipping Name 2'
        },
        body.order.customer.phone_1 ? {
          "value": body.order.customer.phone_1,
          "type": 'phone',
          "description": 'primary'
        },
        body.order.customer.phone_2 ? {
          "value": body.order.customer.phone_2,
          "type": 'phone',
          "description": 'secondary'
        },
        body.order.customer.fax ? {
          "value": body.order.customer.fax,
          "type": 'fax',
          "description": 'primary'
        },
        body.order.customer.email ? {
          "value": body.order.customer.email,
          "type": 'email',
          "description": 'primary'
        }
      ],
      "calendars": [],
      "categories": []
    }
  }`).evaluate(msg);


  return expression;
};