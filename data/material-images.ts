
export const materialImageMap: Record<
  string,
  {
    url: string;
    attribution: string;
    sourceUrl: string;
  }
> = Object.fromEntries(
  [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTabSoFK-78va84AW5rhdAPdN6WY9NR6lLAbG6c1Cb8Ig&s=10", // MAT001
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzO-P85eu1lRDPw0SLpd9N9P1zl-Kq4XkdZtbPhKKKqQ&s=10", // MAT002
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGo_aU6jJwXSrPcb4bo355IkRjCKwxmwAmQiqcXlxU6g&s=10", // MAT003
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaJ1HltMA0JztbTR_oDB0KyquuY2Z9IjvSNl4bYg5PlQ&s=10", // MAT004
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLPqxaKhXqdrca8ByHICwr-Q8AKwAgSpNppPoLFm4waA&s=10", // MAT005
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIKS4cpzxslo1XujrqgCBpoqqFFHOvJRVXoJMLdiEE2w&s=10", // MAT006
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAMvuZ8FkaMXzX483awSjkOXri1rikIgyGfRcxAUAp5g&s=10", // MAT007
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq9w_jSsDpEGVAtebzDXUBRO97A0q1IvmW4ozTHNFLkg&s=10", // MAT008
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxw3IcCpgvehZUF8wZZd0GG-NpnaOjihsQsvM5pVJr3g&s=10", // MAT009
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7T7UuJvPZj9_CQa4Knk0_A7st2IC9IL0R571t-OmPgQ&s=10", // MAT010
    "https://tiimg.tistatic.com/fp/2/008/935/rice-husk-ash-powder-944.jpg", // MAT011
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNTkNMXIC3bkhpdNWb9rVZeGkoi6damxVDX57KYcCAbg&s=10", // MAT012
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_qGBW4voKT5mabAu_LnNFRnVmich915KS_VMRsl8Trg&s=10", // MAT013
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJvTypw5Q4ZRTj3M2OzBBfq3hg7_hJRKX6tws2kncFCQ&s=10", // MAT014
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrtTQRW2JkxTPuMqrspCHKlvKxYHq9AK4JhcEGvwWBWg&s=10", // MAT015

    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGRR1GNJo1JKq2Ua0pL2jPtgvhNu-njEJCeEcQOS7TaA&s=10", // MAT016
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5oD3rJUMUFR_7o8eopWEzWkg51Y1w2QTEQpDyo9s0FA&s=10", // MAT017
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtbLY_Ia8Zcyu50M2RNXmJ-fhWJYPg89uNPAiTeUwGRA&s=10", // MAT018
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKHiSmH0xcCx8SrcgH-Pm5JpTj4btRHXeiUKSiHWoK2A&s=10", // MAT019
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLkww78sNJ-48DCJhZ9OUtIeK4PUoshOhc82UluxU9-g&s=10", // MAT020
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrzz5s0rSznLCZlz6pGdfpzOi5XT6hIXXlerxkrLyXHg&s=10", // MAT021
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5mnNbY7B7zc4NdvA7q2-Jq_HKEKmvQl4L-q5eycc5L1i9RHy74cbd_ko&s=10", // MAT022
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlDP-Zr7Iid5j3kqgG1yB8e_iKh_iwwNulEVitIhJmIA&s=10", // MAT023
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE7nske8os85F0eMgZssUXQqyhQLvz9tLLAOuTAOhHYg&s=10", // MAT024
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJpBNSLJYlG_1doqhIxIn1uJsgnSj3JacGw40VvZSKag&s=10", // MAT025
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMsPrIYhCQDU8a1DyIxeU7I1n0YE3g00hjrVyMJwcoFA&s=10", // MAT026
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgn0R7qbpZn79KbDja_fxdneov459ZNpA1BBjH6DzlBA&s=10", // MAT027
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW9ZgtCV8dK-Tqs9Z-BUxsHkuUT60EqxQ-WA-LvUJMSg&s=10", // MAT028
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYhjzuURKu_jEtgJ8Imi61fGO8kG_11yKg2GPEi5iEqA&s=10", // MAT029
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiUs_3kwyRJOsc9wOeWv1BcMEGlIZpHdP21pobY6RD1Q&s=10", // MAT030

    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFEOnCFBFYisTZvROnJKFO5ybLmpHCK3ibVlfFrvpCEA&s=10", // MAT031
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ8Tlpk-nQmkAjCAsXZ8nq4xnA1GMt1b4KOs7fziJUQA&s=10", // MAT032
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRtKjq_lUtn2trZ4w69bBaYb-OmznQlcHDeD4Htgc7lw&s=10", // MAT033
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbbWNqtBlblDQdgooLw3iWzWIscLoNFw5ETUfcan6vZg&s=10", // MAT034
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBm3rF80I3HJU7KlZ6MnDpikNQWqiyhFG_AmSxpHjY5w&s=10", // MAT035
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0aivV8Vxcgm5snCbt_BtSiY7V4OS6MV7vzErNNwLOeg&s=10", // MAT036
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJBLs6cKyiBDK9j29f2zYzrnqMrLJJHcteK0QeXbsPog&s=10", // MAT037
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQTsu-sC45ChQuGjZUSLntEfcqEDIDKuPSP8HE1RI2PQ&s=10", // MAT038
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL7LS7AbVKbv4cW_5IfrBQ8Sk79ol833nx3sXGDybH7A&s=10", // MAT039
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_IhpKZqYFEX7ZdlnQYrbShxjfdUzNi_4I3l-cd7yxTQ&s=10", // MAT040
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU2NMzBF2BC1b9UcReo6y0peGdXqoHk4YM6Mre5ByKiA&s=10", // MAT041
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl05VvY46gZdpTcAzgNKs76Qvnxg1Bh1Sw0_8_ftTfQQ&s=10", // MAT042
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzNzzsGhCogVp11gG2iqOlL0A0fUJ8pM5WGHql86ujVw&s=10", // MAT043
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw0EmnOdEO_5gEmJnxfLXDr7xyOiN_apFaN1DH1wcknQ&s=10", // MAT044
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF9Q8jqqS0eSjl1iyyydJygpT8TvRmt2y00cQF1lFpOA&s=10", // MAT045

    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqr5ExgrzkpSYTUYDwn7oq5eOR8AaHQClMgtax0ypzWA&s=10", // MAT046
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNW7L8Y7p9ChdwS57zOCB_QQXIC_XaOkMFSU61waojUg&s=10", // MAT047
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSqlrKcZ18WfrSfnBahMSQdLYEVvfjfzE919WcmeL08g&s=10", // MAT048
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTml8TZQNC4aK1YaYOLQy76Cw9iIZcsjrpR18BRl2NBeA&s=10", // MAT049
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHq5GaUAyTqGFDvSjM3IboCiJnvh9jLAa1Uj_tiJMkFA&s=10", // MAT050
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeQ2OmitAFFlHpR1WOHFdSeJzqIUjxuMGp16-iirQe-A&s=10", // MAT051
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtFoeBpzECSv53jXSkK_XOPECIk1FdHmvZDOAGi6iVEw&s=10", // MAT052
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ZnllvGoRLweZOfeyJdapFj548AN-VGfMD1xHtycdZg&s=10", // MAT053
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSJ-FVbND8nmDaD3saQ_X9UzFMQYm9u2aiYaZrz0k8MA&s=10", // MAT054
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5O936W2Z8Xai3YQFbEsWJaEdfgKyCRKoKRSQuQdsr7Q&s=10", // MAT055
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfEUDsnY3jjMHuJ4CBVF-iJGIgCrUaq_3zoPyeErOG9Q&s=10", // MAT056
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE8hfZapYM1XLOJYxbTbQI0Dzci28_msjFOM5QwAy1UA&s=10", // MAT057
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_1yDNMIa9kKpDkFiye-mxmsmqcLKWaEg_DtZDn_mD-A&s=10", // MAT058
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk7IfHmZMpEe2QbDyoln95u4ssaKm1Wos_sIDkPNTuhQ&s=10", // MAT059
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREmXO2dzAXTcXzI0LMrxvNIWir0UsCk5hI5xabzPPN5A&s=10", // MAT060

    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNuEJlirVj2hIGlZGK9E1iTyaaFa9Oen4a8xg-z3t4wA&s=10", // MAT061
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3rqwyX_vEIJqn6mDP1hTfjVa2lqPCH1JUmf-Ej_rIyg&s=10", // MAT062
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7oaDhVj2BnK6kRtOFbhgNa0e-dVq6SXuluh_Mxrme0g&s=10", // MAT063
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST5tb_s2QADJg_JO7mP7Tu4Auk4vl_5fZp1RQQwrX6Gw&s=10", // MAT064
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwZbVwemZG6IK2DSkOM_TNsuRDT4BcvSTNYXyvlBx1fw&s=10", // MAT065
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7vEXyguiNb0_ADJMefgoirPUPN1BxmLyQt2Qq_zPP3g&s=10", // MAT066
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz5kmDlvFMLLTGR2HiogpLwDgXkscyIFAMWebjqdqjdw&s=10", // MAT067
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBz4_rdFgAc24rimXPmqYNQYZeJid8_iu1297maY2MCQ&s=10", // MAT068
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhjcJ51Z4UGl-IhCLolAdjvymjZw0IHhk_pKmsr3Qy0Q&s=10", // MAT069
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTndasdruB7ZLg_iq38DHHvd-6SA1LLxjQ8lkMMbsZAmA&s=10", // MAT070
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_C7FBQQTfXttJz9Ad9qeQL6GDSShDonZOpT03CAaaUQ&s=10", // MAT071
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWdSl-X97O9pzBqZ1Hm-yOPWi5tn8OnmCTeQRZTe3J-g&s=10", // MAT072
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBnxwLmbDABdLXl2GyVzU3QZoAMn7Z8Ko8bkYuUE1FNg&s=10", // MAT073
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwSNmnh-6T6s87VzFWc2dRYxrTUungsBU4Mlp-eA2nMg&s=10", // MAT074
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE3Soctl9UqocnqEccAnmPRlKnM_nIA8Vhz1cBPCuhqw&s=10", // MAT075

    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKMgs-TsqeEwO6zJyZOnevofrro8tz_J1nv0mvu3ns0Q&s=10", // MAT076
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3e2DrCQ2SovZ4pOm5aXDgIRzsyoQl7HyUu_wBQZzSug&s=10", // MAT077
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPtk2pQ5IoUCi0xJF9MiVBrmXTyzksEC4PUFc1ESu_5Q&s=10", // MAT078
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8Sa96PbWylRL1Ylae4_JBvpdGfJrMe6Xei0K7QC9jbw&s=10", // MAT079
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ1lMLDbhdFinHuBuyYhBA0oSzD6pddlAoWgkgMO7-hQ&s=10", // MAT080
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsW5hJGEUkO0OV_6ch4G_HDNp3YzLRrfFIJlvChf21Jw&s=10", // MAT081
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBUBy4QrUeiBU5y5oscGSwppJyO3xPqeEabvaQG1lKRw&s=10", // MAT082
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDPLkx9r1LWCt33w6uPzx9G2OVSwYRySLluXQn-bZn2g&s=10", // MAT083
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSizR3ZQujI81qoqsU1Qnc1H722sT_JZzyatxkf6eRQ8g&s=10", // MAT084
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTEndiYtGvvNj5lxTV_84G08eUKXsaE8eL-GOnu9umsg&s=10", // MAT085
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlEuik92BNC1o1jCssGmAWUEWDkPJpbcrmLcmbTqj_3w&s=10", // MAT086
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEPOYzxg0ZOrqm5WXpEpYz_XAWJgH37HklX4XUVj9Pbg&s=10", // MAT087
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH4TRpQLu6_o1Ii55eow_G_inoEDivUOLIncDUxfWPQg&s=10", // MAT088
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQghm97d8YOsVeG8qmlIpfeTiVDdL_Ws4Ww6EmL55Nmqw&s=10", // MAT089
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8qn6GCm3bRZ4PniI--EnKs-D_vMFOUFf6BNftMMhMOg&s=10", // MAT090

    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBpJ8J4ckAVKRF00Srf3vssc34h4F8shJ4uuFXjiyhOw&s=10", // MAT091
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPf-8kAEQW0uqU80IRHequDSTE21qnv709eS3OiL4BfQ&s=10", // MAT092
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp9MJueNV-iQoc7iU9Nh9nRZvbM0YG0zAKf4beHr0QQQ&s=10", // MAT093
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtYxYLiPixlQqVBnE_ISpUrg_1Pvd2kKTi97pEIOGTMg&s=10", // MAT094
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU46lLQEmeOvUNsDmJbJTg1X_tpNOynL_SCOKdNP_DWg&s=10", // MAT095
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb48jY7VFnewH2l-I8zhju6jfNSAjmLiZ3LK7RW8lfLg&s=10", // MAT096
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPSGhKvyFm_2y4YNGGeKgmLXUjjJQ451BLXYQ-MgtNzA&s=10", // MAT097
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxLGHqGOiSTBFf9H6gn1qUcpp7kZs9Mw5KHKq10WGGWw&s=10", // MAT098
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI_FMTrQFWjsZfF0JGET9ak77XrHnyypW7FJWgMB-XUA&s=10", // MAT099
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC4qrUTsPyWZuW8cjA05bstoDs1OjL9DYyG_63GcMBZg&s=10", // MAT100
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDctxEeh0DaEXn_Vafz9vHlyo2nmXiElAql1to7niueg&s=10", // MAT101
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4gbJUFRDHWbwuN81rUQkAyHD2LjbV_X1Xgkpo4N9pLw&s=10", // MAT102
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjPxpHpkzrAxuN8WRKVrjUCFRAB2h2bKJTZOnUiUszPA&s=10", // MAT103
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbky_Nm0TzhWguyI0H2o2J3Ncllm3qGG162e-PPv1Keg&s=10", // MAT104
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSid58cMHseEtXgVgVPu-sl-ECG3YQ2rigvIy36RohyVQ&s=10", // MAT105

    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQYwaOfOYLvTn4QQfE5LBj35agVVeBrwCmMWY_0DsaEQ&s=10", // MAT106
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiG5dRlV185JqNT-5_1nwqXi70SVFJBxAl3gQeQOyN_w&s=10", // MAT107
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm5QO5PV-yKcR1Jo_uCCtlslTuFLI0CcisHm92KbKGDQ&s=10", // MAT108
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST0iA-BOc_LIDEcTLp0OjTfpF0TUJ3w12rej_fe2sNLQ&s=10", // MAT109
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStgf7E2xKpK7EcVWAO1a3ebGgWtcX58Vis_kfIRjmBeQ&s=10", // MAT110
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ6zq6zScaCgDyu6ahVPbYfw_DMGZXtt_R5XLVfzcK6g&s=10", // MAT111
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSknDdiHzZMmiusZg9qFb1W7GFM9PHaUGoY-PVsvoE2cw&s=10", // MAT112
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR97CJR6iBMijw50r9SXk3o6ZLlu7EW-vqV7vHxuw8GhA&s=10", // MAT113
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuOS1remBnmmp7XFRmLaPEm5OB5Lh8wFGQn7Lt-29TYg&s=10", // MAT114
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYdCMnIyqj2XqS3CRIux67b3Ji1g7IyfwcUXkbEytaOQ&s=10", // MAT115
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNofMxbBpjm2ejzAANwt9oAFpEIXdbV7aKYQ33jhM4NA&s=10", // MAT116
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw9Adio2jFaEOa1zfFMWHQVJPWpWKc1E3oJDfVyOnxSg&s=10", // MAT117
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF9-lmEIFsRXedumXO35VAi1dcByZxnhLfhtIYQn7W8g&s=10", // MAT118
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg8iFujSI1wGuz_2b6mEC6sIIpd9OnlDxuoTDVKlKTKw&s=10", // MAT119
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL8B5i6wplmdHW5G-OvVetnexQ-k0JjYN7dlISchwhIw&s=10" // MAT120
  ].map((url, index) => {
    const id = `MAT${String(index + 1).padStart(3, "0")}`;

    return [
      id,
      {
        url,
        sourceUrl: url,
        attribution: "Image link supplied in SustainAI workbook"
      }
    ];
  })
);
