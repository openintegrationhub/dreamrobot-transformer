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

  // var lineItems_temp = [];
  //
  // msg.body.data.lineItems.forEach(function($value,$index)
  // {
  //   lineItems_temp[$index] = {
  //     "id":             $index,
  //     "name":           $value.name,
  //     "sku":            $value.sku,
  //     "quantity":       jsonata(`$string("${$value.quantity}")`).evaluate(),
  //     "price":          jsonata(`$string("${$value.price}")`).evaluate(),
  //     "tax":            jsonata(`$string("${$value.taxAmount}")`).evaluate(),
  //     "transaction_id": $value.productId,
  //     "stock_align_id": $value.externalId
  //   }
  // });

  const expression = jsonata(`{
    "meta":{
      "recordUid": body.meta.recordUid!=undefined and body.meta.recordUid!=undefined ? body.meta.recordUid!=undefined : "",
			"oihUidEncrypted": (body.meta.oihUidEncrypted!=undefined && body.meta.oihUidEncrypted!=null) ? body.meta.oihUidEncrypted : 'oihUidEncrypted not set yet'
    },
    "data":{
    "order" : {
      "portal_account_id": undefined,
      "platform": body.data.references[0].externalApplicationName,
      "current_date": undefined,
      "customer": {
        "id": undefined,
        "username": body.data.references[0].externalId,
        "comment":  body.data.additionalInformation,
        "vat_id": undefined,
        "email": 	body.data.customer.contactData[type='email'].value,
        "phone_1":  body.data.customer.contactData[type='phone'][description='primary'].value,
        "phone_2":  body.data.customer.contactData[type='phone'][description='secondary'].value,
        "fax": 		body.data.customer.contactData[type='fax'].value,
        "address": {
          "name":         body.data.customer.firstName & " " & body.data.customer.lastName,
          "name_2":       body.data.customer.contactData[type='name'][description='Billing Name 2'].value,
          "street":       body.data.customer.addresses[0].street & " " & body.data.customer.addresses[0].streetNumber,
          "street_2":     body.data.customer.addresses[0].unit,
          "zip":          body.data.customer.addresses[0].zipCode,
          "city":         body.data.customer.addresses[0].city,
          "province":     body.data.customer.addresses[0].region,
          "country":      body.data.customer.addresses[0].country,
          "country_iso2": body.data.customer.addresses[0].countryCode
        }
      },
      "shipping": {
        "fee":            body.data.shipping.fee,
        "date":           body.data.shipping.date,
        "deliverer":      body.data.shipping.deliverer,
        "code":           body.data.shipping.code,
        "method":         body.data.shipping.method,
        "address": {
          "name":         body.data.shipping.address.primaryContact,
          "name_2":       body.data.customer.contactData[type='name'][description='Shipping Name 2'].value,
          "street":       body.data.shipping.address.street & " " & body.data.shipping.address.streetNumber,
          "street_2":     body.data.shipping.address.unit,
          "zip":          body.data.shipping.address.zipCode,
          "city":         body.data.shipping.address.city,
          "province":     body.data.shipping.address.region,
          "country":      body.data.shipping.address.country,
          "country_iso2": body.data.shipping.address.countryCode
        }
      },
      "invoice_amount": $string(body.data.invoiceAmount),
      "currency_id": body.data.currency,
      "status": {
        "is_parked": body.data.status[qualifier='parked'].value,
        "is_initial_contact": body.data.status[qualifier='initialContact'].value,
        "paid_date": $fromMillis($toMillis(body.data.status[qualifier='paid'].qualifiedOn),'[Y0001]-[M01]-[D01]'),
        "is_paid": body.data.status[qualifier='paid'].value,
        "is_packed": body.data.status[qualifier='packed'].value,
        "packed_date": $fromMillis($toMillis(body.data.status[qualifier='packed'].qualifiedOn),'[Y0001]-[M01]-[D01]'),
        "is_shipped": body.data.status[qualifier='shipped'].value,
        "shipped_date": $fromMillis($toMillis(body.data.status[qualifier='shipped'].qualifiedOn),'[Y0001]-[M01]-[D01]'),
        "is_arrived": body.data.status[qualifier='arrived'].value,
        "arrived_date": $fromMillis($toMillis(body.data.status[qualifier='arrived'].qualifiedOn),'[Y0001]-[M01]-[D01]'),
        "initial_contact_date": $fromMillis($toMillis(body.data.status[qualifier='initialContact'].qualifiedOn),'[Y0001]-[M01]-[D01]'),
        "is_cancelled": body.data.status[qualifier='cancelled'].value,
        "cancelled_date": $fromMillis($toMillis(body.data.status[qualifier='cancelled'].qualifiedOn),'[Y0001]-[M01]-[D01]'),
        "is_checkout": body.data.status[qualifier='checkout'].value
      },
      "date": body.data.startDate,
      "pack_infos": body.data.hiddenInfos,
      "infos": body.data.information,
      "paid_amount": body.data.paidAmount,
      "bill_url":  body.data.billUrl,
      "payment_method_id": body.data.paymentMethodName,
      "invoice_number": body.data.invoiceNumber,
      "line": $map(body.data.lineItems,function($v,$i,$a){{  
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
  }}`).evaluate(msg);

console.log(`OKi Doki: ${expression}`);
  return expression;
};