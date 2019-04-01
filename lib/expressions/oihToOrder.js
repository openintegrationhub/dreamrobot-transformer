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

  var lineItems_temp = [];

  msg.body.lineItems.forEach(function($value,$index)
  {
    lineItems_temp[$index] = {
      "id":             $index,
      "name":           $value.name,
      "sku":            $value.sku,
      "quantity":       jsonata(`$string("${$value.quantity}")`).evaluate(),
      "price":          jsonata(`$string("${$value.price}")`).evaluate(),
      "tax":            jsonata(`$string("${$value.taxAmount}")`).evaluate(),
      "transaction_id": $value.productId,
      "stock_align_id": $value.externalId
    }
  });

  const expression = jsonata(`{
    "order" : {
      "portal_account_id": undefined,
      "platform": body.references[0].externalApplicationName,
      "current_date": undefined,
      "customer": {
        "id": undefined,
        "username": body.references[0].externalId,
        "comment":  body.additionalInformation,
        "vat_id": undefined,
        "email": 	body.customer.contactData[type='email'].value,
        "phone_1":  body.customer.contactData[type='phone'][description='primary'].value,
        "phone_2":  body.customer.contactData[type='phone'][description='secondary'].value,
        "fax": 		body.customer.contactData[type='fax'].value,
        "address": {
          "name":         body.customer.firstName & " " & body.customer.lastName,
          "name_2":       body.customer.contactData[type='name'][description='Billing Name 2'].value,
          "street":       body.customer.addresses[0].street & " " & body.customer.addresses[0].streetNumber,
          "street_2":     body.customer.addresses[0].unit,
          "zip":          body.customer.addresses[0].zipCode,
          "city":         body.customer.addresses[0].city,
          "province":     body.customer.addresses[0].region,
          "country":      body.customer.addresses[0].country,
          "country_iso2": body.customer.addresses[0].countryCode
        }
      },
      "shipping": {
        "fee":            body.shipping.fee,
        "date":           body.shipping.date,
        "deliverer":      body.shipping.deliverer,
        "code":           body.shipping.code,
        "method":         body.shipping.method,
        "address": {
          "name":         body.shipping.address.primaryContact,
          "name_2":       body.customer.contactData[type='name'][description='Shipping Name 2'].value,
          "street":       body.shipping.address.street & " " & body.shipping.address.streetNumber,
          "street_2":     body.shipping.address.unit,
          "zip":          body.shipping.address.zipCode,
          "city":         body.shipping.address.city,
          "province":     body.shipping.address.region,
          "country":      body.shipping.address.country,
          "country_iso2": body.shipping.address.countryCode
        }
      },
      "invoice_amount": $string(body.invoiceAmount),
      "currency_id": body.currency,
      "status": {
        "is_parked": body.status[qualifier='parked'].value,
        "is_initial_contact": body.status[qualifier='initialContact'].value,
        "paid_date": $fromMillis($toMillis(body.status[qualifier='paid'].qualifiedOn),'[Y0001]-[M01]-[D01]'),
        "is_paid": body.status[qualifier='paid'].value,
        "is_packed": body.status[qualifier='packed'].value,
        "packed_date": $fromMillis($toMillis(body.status[qualifier='packed'].qualifiedOn),'[Y0001]-[M01]-[D01]'),
        "is_shipped": body.status[qualifier='shipped'].value,
        "shipped_date": $fromMillis($toMillis(body.status[qualifier='shipped'].qualifiedOn),'[Y0001]-[M01]-[D01]'),
        "is_arrived": body.status[qualifier='arrived'].value,
        "arrived_date": $fromMillis($toMillis(body.status[qualifier='arrived'].qualifiedOn),'[Y0001]-[M01]-[D01]'),
        "initial_contact_date": $fromMillis($toMillis(body.status[qualifier='initialContact'].qualifiedOn),'[Y0001]-[M01]-[D01]'),
        "is_cancelled": body.status[qualifier='cancelled'].value,
        "cancelled_date": $fromMillis($toMillis(body.status[qualifier='cancelled'].qualifiedOn),'[Y0001]-[M01]-[D01]'),
        "is_checkout": body.status[qualifier='checkout'].value
      },
      "date": body.startDate,
      "pack_infos": body.hiddenInfos,
      "infos": body.information,
      "paid_amount": body.paidAmount,
      "bill_url":  body.billUrl,
      "payment_method_id": body.paymentMethodName,
      "invoice_number": body.invoiceNumber,
      "line": $map(body.lineItems,function($v,$i,$a){{  
      	"id": $i,
        "name": $v.name,
        "sku": $v.sku,
        "quantity": $v.quantity,
        "price": $v.price,
        "tax": $v.taxAmount,
        "transaction_id": $v.productId,
        "stock_align_id": $v.references[externalApplicationName='dreamrobot_stock_id'].externalId}
      })
    }
  }`).evaluate(msg);


  return expression;
};