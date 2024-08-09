async function main() {

    let res = await fetch("https://www.bewakoof.com/api/rr/v1/review-images?from=0&size=6&manufacturerBrandId=9&dt=6:7:2024:21", {
        "headers": {
          "ab-id": "40",
          "accept": "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "api-token": "MWY5ZTNmNzFmN2M1ZTUyMjkwNjM2NGMzNmNjZTA3N2Q6M2RhMmI3OTgtNTY2MC00ZDRhLWJhZWQtNTZlMDI2MWRlYmZm",
          "client-device-token": "MWY5ZTNmNzFmN2M1ZTUyMjkwNjM2NGMzNmNjZTA3N2Q6M2RhMmI3OTgtNTY2MC00ZDRhLWJhZWQtNTZlMDI2MWRlYmZm",
          "content-type": "application/json",
          "isbshotsapp": "false",
          "microapp": "",
          "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjI1NjM0MTMiLCJhcCI6IjExMzQwODMwMDkiLCJpZCI6IjdiYWYwMmY4YmRmMTFkMzAiLCJ0ciI6ImUxMWZiODZkZDc1NDE3MDEzYTBkMTYyNzk2NzEyNmM0IiwidGkiOjE3MjI5NjU0OTc2MTR9fQ==",
          "preferred-location": "IN",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "switch-platform": "false",
          "token": "3d1378f574f42a779c190d62f937cb80",
          "traceparent": "00-e11fb86dd75417013a0d1627967126c4-7baf02f8bdf11d30-01",
          "tracestate": "2563413@nr=0-1-2563413-1134083009-7baf02f8bdf11d30----1722965497614",
          "x-http-method-override": "GET",
          "x-newrelic-id": "VgMBUlJSCxABVFRSBQIBUFUE",
          "cookie": "isMember=false; exp_trk_id=b1d8e4c3-0f32-453c-b198-bce451be2759; abId=40; gb-plp-bucket=%7B%22experiment_id%22%3A%22plp_score_fake%22%2C%22bucket_id%22%3A%22default__plp_score1%22%7D; gb-best-seller-bucket=%7B%22experiment_id%22%3A%22best_seller%22%2C%22bucket_id%22%3A%22default%22%7D; _gcl_au=1.1.287086026.1722438746; __utmz=other; _fbp=fb.1.1722438745846.715420495180910862; _gac_G-1QFG6DKH49=1.1722438746.Cj0KCQjwwae1BhC_ARIsAK4JfrxwRnsWgBtcNLaALxOzIVZXjyFVmtICY4vHqel7K-Kd7rAdEkjeynAaAqB5EALw_wcB; _scid=e3e06572-563a-4752-8217-a1c8ce476f61; _ScCbts=%5B%5D; _sctr=1%7C1722364200000; row_set=28; _gcl_gs=2.1.k1$i1722439013; _gcl_aw=GCL.1722439137.Cj0KCQjwwae1BhC_ARIsAK4JfrxwRnsWgBtcNLaALxOzIVZXjyFVmtICY4vHqel7K-Kd7rAdEkjeynAaAqB5EALw_wcB; _gid=GA1.2.1572476023.1722856217; WZRK_G=c6f3da0b98a14e3388d9a49e8110193e; cto_bundle=VYbhWV81SjRyUW44VDc1V1ZCM0NGaEhLQk90elpINWw3M1BpRDc3aE5YdzFYWGpzakZsYW5qVTJKSnZPSmFIeE9seDMwMG5CaXNKMEZwQTl6TFpZY3F0djdkMiUyRlZjb0prNmEzbXNMVTZJVGJjVW9va2JaczJjb2J3NkRWd2pxYTc4N1kxQkFKdExkYkFKdHpoOVJFRFRRVFUyTlVmYVlJVThtY2h5JTJGT3Q4b0glMkZaYTdacUJEQ2c4Y0kwbjlqJTJCQWRwQ1FKaVRaMW13cWpvNjZOU3ZXNXRSSndLeUElM0QlM0Q; _gat=1; _ga=GA1.2.209805872.1722438746; _scid_r=e3e06572-563a-4752-8217-a1c8ce476f61; WZRK_S_8R9-845-Z84Z=%7B%22p%22%3A6%2C%22s%22%3A1722964732%2C%22t%22%3A1722965491%7D; _ga_1QFG6DKH49=GS1.1.1722964734.9.1.1722965493.0.0.0",
          "Referer": "https://www.bewakoof.com/p/motd-panda-half-sleeve-t-shirt",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      });

    let data = await res.json();

    console.log(data);

}



main();