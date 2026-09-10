/**
 * Bulk luxury listings gathered from public agency category pages (Sept 2026).
 * Real facts — title, price, beds/baths/size, location, agency link.
 * One pipe-delimited line each:
 *   type | priceTHB | bd | ba | sqm | city | district | title | agency | url
 *
 * Descriptions are generated from templates; photos are representative stock
 * (real og:images attach when the ingestion pipeline refreshes a listing).
 */

const RAW = `
villa|13800000|4|4|241|Phuket|Rawai|4-Bedroom Pool Villa at Lucky Pool Villa|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-lucky-pool-villa-rawai-phuket_fce3fa3346fd-325e-5c92-a9ad-c4e5d089
villa|15750000|4|5|385|Phuket|Kamala|4-Bedroom Villa at Kamala Nathong House|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-kamala-nathong-house-kamala-phuket_9c0c9b97981d-79fe-6b82-1642-b2e5d089
villa|35000000|4|5|350|Phuket|Cherng Talay|4-Bedroom Villa at Cherng Lay Villas|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-cherng-lay-villas-and-condominium-choeng-thale-phuket_df0a53183bb0-9f8e-d1d2-d9d1-63e5d089
villa|65000000|6|6|797|Phuket|Si Sunthon|6-Bedroom Villa at Anchan Hills|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/6-bedroom-villa-for-sale-in-anchan-hills-si-sunthon-phuket_276f616680e8-d9de-03b2-b8b3-d3a8c089
villa|18500000|3|3|495|Phuket|Pa Khlok|3-Bedroom Pool Villa in Pa Khlok|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-pa-khlok-phuket_a7d74806e599-99ce-3252-cc0f-25e5d089
villa|18000000|5|5|300|Phuket|Rawai|5-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-rawai-phuket_0aa2c3656813-6b6e-3352-f2ba-36839f89
villa|32000000|5|5|400|Phuket|Chalong|5-Bedroom Pool Villa in Chalong|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-or-rent-in-chalong-phuket_bd61709fb977-9eb1-1542-3df4-41e5d089
villa|8000000|2|3|250|Phuket|Rawai|2-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-or-rent-in-rawai-phuket_51d3fcab1355-0d31-d812-cb3e-d005b089
villa|12500000|2|2|264|Phuket|Rawai|2-Bedroom Villa at Villa Suksan|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-or-rent-in-villa-suksan-soi-king-suksan-4-rawai-phuket_7e6a399bb428-d7ff-f392-b5c9-c1e5d089
villa|35000000|3|4|343|Phuket|Si Sunthon|3-Bedroom Villa at Clover Residence|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-clover-residence-si-sunthon-phuket_f775a39e8e34-1590-9d12-3f4b-71a49f89
villa|7900000|3|3|180|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_fabec8f2e20f-f430-4222-05ef-e6acb089
villa|11900000|3|4|322|Phuket|Thalang|3-Bedroom Villa at Ananda Lake View|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-ananda-lake-view-thep-krasatti-phuket_2b59cf649b05-cc40-b1b2-298f-2e25c089
villa|15000000|4|4|340|Phuket|Rawai|4-Bedroom Villa at Sirinthara|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-sirinthara-rawai-phuket_bc13529433f3-6e91-bc92-986e-94e5d089
villa|14900000|2|2|180|Phuket|Chalong|2-Bedroom Villa at Shambhala Sol|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-or-rent-in-shambhala-sol-chalong-phuket_21de75f1bf60-4871-9642-c914-33a8c089
villa|11900000|3|4|322|Phuket|Thalang|3-Bedroom Villa at Ananda Lake View (Malli)|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-ananda-lake-view-thep-krasatti-phuket_faaf44848c4a-0a61-b472-ea79-9575c089
villa|18500000|4|5|450|Phuket|Ko Kaeo|4-Bedroom Villa at The Lantern|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-the-lantern-ko-kaeo-phuket_db07f1231b21-0c7f-f932-8a34-40a8c089
villa|57519000|4|5|722|Phuket|Ko Kaeo|4-Bedroom Villa at Canopy Hills|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-canopy-hills-villas-ko-kaeo-phuket_3b5bce9f9c4e-0a91-a512-766c-e2e5d089
villa|59000000|10|11|1000|Phuket|Rawai|10-Bedroom Estate in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/10-bedroom-villa-for-sale-in-rawai-phuket_964bdced50ca-0a41-c052-0e12-76159f89
villa|361535873|6|7|1600|Phuket|Pa Khlok|6-Bedroom Villa at The Cape Residences|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/6-bedroom-villa-for-sale-in-the-cape-residences-pa-khlok-phuket_3e7a0a34e1d5-096f-a352-3d76-8739c089
villa|360000000|6|7|595|Phuket|Kamala|6-Bedroom Villa at Jomchang, Kamala|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/6-bedroom-villa-for-sale-in-jomchang-kamala-phuket_972c294d74f9-70d1-fb42-cca5-f4a8c089
villa|25000000|4|5|450|Phuket|Rawai|4-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-rawai-phuket_f2ef038ed507-8efe-b4e2-29c7-a4e5d089
villa|15500000|3|2|350|Phuket|Thalang|3-Bedroom Loft Villa at Wohnfabrik|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-wohnfabrik-phuket-loft-villa-thep-krasatti-phuket_d9d61844bb02-ec90-e082-1d7a-32a8c089
villa|14000000|2|2|303|Phuket|Chalong|2-Bedroom Villa at Kimera Pool Villa|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-or-rent-in-kimera-pool-villa-chalong-phuket_fefd00619030-445e-c1d2-3352-ac15c089
villa|13900000|3|3|220|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_7c7fc7c1fffe-fbf1-3c52-f73c-04e5d089
villa|25000000|3|3|288|Phuket|Si Sunthon|3-Bedroom Pool Villa at Botanica Modern Loft II|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-botanica-modern-loft-ii-si-sunthon-phuket_49afdc527033-e380-3882-e16a-36d5d089
villa|46500000|4|5|400|Phuket|Chalong|4-Bedroom Pool Villa in Chalong|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-chalong-phuket_5524dc7492bb-2ff0-5f82-8bd9-58a89f89
villa|16000000|3|3|350|Phuket|Thalang|3-Bedroom Villa in Thep Krasatti|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-thep-krasatti-phuket_dbad4aae9ea9-18ff-b0e2-4f04-7c149f89
villa|86500000|5|5|1100|Phuket|Pa Khlok|5-Bedroom Beachfront Villa in Pa Khlok|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-pa-khlok-phuket_7301d3920093-893e-d992-bde2-34e5d089
villa|10900000|2|2|208|Phuket|Rawai|2-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-or-rent-in-rawai-phuket_c7162ad7f7df-3411-36b2-913a-3e71b089
villa|35000000|3|3|264|Phuket|Si Sunthon|3-Bedroom Pool Villa in Si Sunthon|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-si-sunthon-phuket_b2018ce2dcaa-6bef-ae12-7010-5fa3d089
villa|14900000|3|4|200|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-rawai-phuket_57622b9433e1-c320-ff62-ed16-a5e5d089
villa|54000000|10|11|780|Phuket|Surin|10-Bedroom Sea View Villa at Baan Thai Surin Hill|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/10-bedroom-villa-for-sale-or-rent-in-baan-thai-surin-hill-choeng-thale-phuket_e255cfa92ec0-efaf-fa82-51c6-5fa29f89
villa|56700000|4|4|595|Phuket|Cherng Talay|4-Bedroom Villa at The Pavilions Residence|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-the-pavilions-phuket-choeng-thale-phuket_4c44848e5268-aa0f-8602-1ea4-e4a8c089
villa|26000000|3|4|350|Phuket|Kathu|3-Bedroom Premium Villa at Indochine|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-indochine-villa-santi-patong-phuket_7f724a11fafe-23df-e432-ef93-02e5d089
villa|24900000|3|4|373|Phuket|Thalang|3-Bedroom Pool Villa at Gold Chariot|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-gold-chariot-choeng-thale-phuket_d639fd11c276-9ff1-1822-ce36-a242c089
villa|29500000|4|5|380|Phuket|Si Sunthon|4-Bedroom Pool Villa in Si Sunthon|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-si-sunthon-phuket_71ab2506d30c-cf8f-f642-db5e-cb519f89
villa|14900000|3|5|275|Phuket|Pa Khlok|3-Bedroom Pool Villa at Veronica Cape Vista Yamu|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-veronica-cape-vista-yamu-pa-khlok-phuket_7c0ae786f012-6220-92c2-bb8a-b4239f89
villa|21100000|3|3|369|Phuket|Si Sunthon|3-Bedroom Villa at Villa Qabalah|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-villa-qabalah-si-sunthon-phuket_75402df436b1-0440-9592-1d02-2df0c089
villa|25850000|4|6|583|Phuket|Rawai|4-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-rawai-phuket_52242333fbf9-a39f-14f2-cf83-5eb89f89
villa|13800000|3|3|180|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_6a4c6e4c035f-ba1f-9af2-fdf3-6be5d089
villa|22900000|4|4|580|Phuket|Chalong|4-Bedroom Pool Villa at Land and House Park|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-land-and-house-park-phuket-chalong-phuket_0d342653b530-b2f1-4052-601f-21e5d089
villa|16900000|4|4|245|Phuket|Chalong|4-Bedroom Villa at Baan Chalong Residences|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-baan-chalong-residences-chalong-phuket_267e972bcb6d-594e-1052-bd47-ef57b089
villa|13900000|3|3|225|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_3cf9cd736936-13c0-7de2-ab93-0cb99f89
villa|10900000|2|2|178|Phuket|Rawai|2-Bedroom Villa at The Signature Villas|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-or-rent-in-the-signature-villas-rawai-phuket_c6e7ae0108ed-c901-1e32-833f-bfe5d089
villa|260000000|4|4|480|Phuket|Cherng Talay|4-Bedroom Villa at Banyan Tree Beach Residences Aegir|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-banyan-tree-beach-residences-aegir-choeng-thale-phuket_2ee1773286f9-4430-6fc2-fb01-84a8c089
villa|23100000|3|3|300|Phuket|Cherng Talay|3-Bedroom Pool Villa at Luna Phuket|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-luna-phuket-choeng-thale-phuket_b303252aafc1-10de-b302-c0b3-c21ed089
villa|26900000|4|4|470|Phuket|Rawai|4-Bedroom Luxury Pool Villa at Aya|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-aya-luxury-pool-villa-rawai-phuket_d198de77125b-077f-d142-c653-62e5d089
villa|24900000|5|6|294|Phuket|Rawai|5-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-or-rent-in-rawai-phuket_bd52e16cc64f-98d1-0bf2-adf4-b319b089
villa|37400000|4|5|517|Phuket|Ko Kaeo|4-Bedroom Villa at Fortuna Lakeside|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-fortuna-lakeside-ko-kaeo-phuket_500b8e67476b-2bdf-b342-2d29-da15c089
villa|20500000|3|3|266|Phuket|Ko Kaeo|3-Bedroom Villa at The Oasis|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-the-oasis-phuket-ko-kaeo-phuket_fdf9e683cae7-94de-8482-10e3-dcf8b089
villa|59900000|7|5|700|Phuket|Thalang|7-Bedroom Villa in Thep Krasattri|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/7-bedroom-villa-for-sale-in-thep-krasatti-phuket_9a078280ee4b-85c0-4c12-5596-85a8c089
villa|36000000|3|3|418|Phuket|Nai Thon|3-Bedroom Ocean View Villa at Vista Del Mar|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-vista-del-mar-phuket-sakhu-phuket_4d75cd759cd8-1580-f582-c489-30a8c089
villa|31600000|5|5|300|Phuket|Rawai|5-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-rawai-phuket_fd1eea86e872-d2ae-1442-000f-14e5d089
villa|27500000|4|4|280|Phuket|Thalang|4-Bedroom Villa at Botanica The Residence|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-botanica-the-residence-thep-krasatti-phuket_6d0269eaf1cd-695f-d4d2-4694-e3e5d089
villa|14900000|3|4|241|Phuket|Si Sunthon|3-Bedroom Villa at Thala Villas|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-thala-villas-phuket-si-sunthon-phuket_d6b79f521897-d82e-40f2-a729-5ba1c089
villa|24900000|4|5|400|Phuket|Thalang|4-Bedroom Villa at LAMIETT Phuket|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-lamiett-phuket-thep-krasatti-phuket_507f6ee511b3-1fff-24b2-b7a1-08669f89
villa|16000000|4|6|340|Phuket|Si Sunthon|4-Bedroom Villa at Supalai Palm Spring Banpon|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-supalai-palm-spring-banpon-phuket-si-sunthon-phuket_f188c2c8a717-db70-fb52-ccab-3c6fa089
villa|28500000|4|4|355|Phuket|Si Sunthon|4-Bedroom Pool Villa in Si Sunthon|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-si-sunthon-phuket_f80030b512fb-88e0-d852-26a3-24e5d089
villa|48000000|4|3|548|Phuket|Cherng Talay|4-Bedroom Villa at Laguna Village Residences|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-laguna-village-residence-choeng-thale-phuket_196ed981b5fd-251e-b592-da37-b5a8c089
villa|14500000|2|3|120|Phuket|Rawai|2-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-in-rawai-phuket_51e6dfccfe28-fa0f-d612-5aae-f4739f89
villa|18500000|4|4|255|Phuket|Si Sunthon|4-Bedroom Villa at Wallaya Villas The Nest|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-wallaya-villas-the-nest-si-sunthon-phuket_9ed97d751dd5-b68e-b952-bb9c-9ef6b089
villa|20000000|3|3|320|Phuket|Cherng Talay|3-Bedroom Pool Villa at Seastone Pool Villas|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-seastone-pool-villas-choeng-thale-phuket_4a44a0ace6bb-a9e1-5a62-17f8-c0e5d089
villa|22000000|4|3|415|Phuket|Rawai|4-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-rawai-phuket_ebd0258ce392-c73f-40d2-aec1-8e79a089
villa|15800000|2|2|250|Phuket|Si Sunthon|2-Bedroom Villa at Vertica Pool Villa|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-or-rent-in-vertica-pool-villa-si-sunthon-phuket_fa32d7523b7d-d861-5f52-c2e2-7bf0c089
villa|180767936|4|5|400|Phuket|Kata|4-Bedroom Villa at Baan Kata Villa|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-baan-kata-villa-karon-phuket_8ad334d2bac9-2e1e-1fb2-0d77-10a8c089
villa|210000000|6|7|2700|Phuket|Kamala|6-Bedroom Villa at Cape Amarin|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/6-bedroom-villa-for-sale-in-cape-amarin-kamala-phuket_f96f67ccd47e-9090-ef42-2ae6-5529b089
villa|75000000|6|7|1200|Phuket|Patong|6-Bedroom Villa in Patong|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/6-bedroom-villa-for-sale-or-rent-in-patong-phuket_e246ffd2c7f2-3360-18c2-8d35-84e5d089
villa|95000000|7|7|452|Phuket|Patong|7-Bedroom Villa in Patong|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/7-bedroom-villa-for-sale-or-rent-in-patong-phuket_6b755d2e4cf7-3df0-d9c2-669d-2fe5d089
villa|17900000|3|3|203|Phuket|Si Sunthon|3-Bedroom Villa at The Pak Pool Villa|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-the-pak-pool-villa-si-sunthon-phuket_22b539df7c31-634f-1262-c324-17e2a089
villa|15105841|3|2|245|Phuket|Rawai|3-Bedroom Villa at Rawai VIP Villas Phase 4|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-vip-villas-phase-4-rawai-phuket_2841048149d5-3711-eac2-6388-f5e5d089
villa|29900000|5|6|440|Phuket|Rawai|5-Bedroom Villa at Brianna Luxuria Villas|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-brianna-luxuria-villas-rawai-phuket_d56c65011208-31c1-14b2-5348-82e5d089
villa|15200000|3|3|190|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_b9a9646b1d61-d0bf-4fc2-9131-7df0c089
villa|15000000|3|3|160|Phuket|Rawai|3-Bedroom Villa at Villa Suksan|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-villa-suksan-soi-king-suksan-4-rawai-phuket_9a98fa52a850-5fff-3c72-142b-b3a8c089
villa|71000000|4|6|670|Phuket|Rawai|4-Bedroom Luxury Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-rawai-phuket_212d888ed5d6-5f50-a762-2efa-a1e5d089
villa|39900000|4|5|442|Phuket|Si Sunthon|4-Bedroom Villa at The Lake House|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-the-lake-house-si-sunthon-phuket_dd4a3e886172-ef21-f132-3f5b-b0e5d089
villa|30975000|4|4|214|Phuket|Si Sunthon|4-Bedroom Villa at BOTANICA Modern Loft|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-botanica-modern-loft-si-sunthon-phuket_44aa61817129-7241-3412-f5a0-a2e5d089
villa|45000000|3|3|499|Phuket|Cherng Talay|3-Bedroom Villa at The Residence Resort|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-the-residence-resort-and-spa-retreat-choeng-thale-phuket_a1ea1bdcb639-5a30-fe52-76da-13e5d089
villa|19900000|3|3|392|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-rawai-phuket_1741f93d48a7-a1ef-e582-ffa4-e4b59f89
villa|25000000|3|3|310|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_bf9d06b6f783-c52e-f0d2-e84b-e4e5d089
villa|80688233|5|8|1800|Phuket|Pa Khlok|5-Bedroom Villa at Baan Yamu Residences|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-baan-yamu-residences-pa-khlok-phuket_8198f38773d0-b7a0-f1b2-f56c-16fab089
villa|45200000|4|5|420|Phuket|Cherng Talay|4-Bedroom Villa at Botanica Grand Avenue|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-botanica-grand-avenue-choeng-thale-phuket_9f8d6667538f-68c0-71b2-446a-82e5d089
villa|17800000|2|2|89|Phuket|Chalong|2-Bedroom Villa at Villa Zolitude|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-in-villa-zolitude-chalong-phuket_f3da300c8fad-c851-eb32-ac9c-501aa089
villa|25000000|4|5|374|Phuket|Rawai|4-Bedroom Villa at Monetaria Villas|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-monetaria-villas-rawai-phuket_03aa40c3ff26-489f-c282-7815-96999f89
villa|32000000|3|3|320|Phuket|Nai Thon|3-Bedroom Sunset Sea View Villa at Vista Del Mar|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-vista-del-mar-phuket-sakhu-phuket_5eb1556c6548-3a11-4b82-dc76-62e5d089
villa|19900000|4|4|309|Phuket|Kamala|4-Bedroom Pool Villa at Kamala Nathong House|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-kamala-nathong-house-kamala-phuket_af6c400d4784-a400-0482-7c5c-ffd5d089
villa|17200000|4|4|200|Phuket|Rawai|4-Bedroom Villa at Villa Toya|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-villa-toya-rawai-phuket_959117183952-7ec1-8bb2-bc8e-25a8c089
villa|37500000|3|3|455|Phuket|Thalang|3-Bedroom Modern Tropical Pool Villa at Anchan Tropicana|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-anchan-tropicana-thep-krasatti-phuket_927d066ccbf1-6370-a862-f3ac-b8d5d089
villa|17000000|4|4|271|Phuket|Bang Tao|4-Bedroom Villa at The Residence Resort, Bang Tao|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-the-residence-resort-and-spa-retreat-choeng-thale-phuket_ff68e4eddea1-7b60-1652-464a-81fad089
villa|89000000|4|4|671|Phuket|Cherng Talay|4-Bedroom Lakeview Villa at Laguna Village|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-laguna-village-residences-phase-8-choeng-thale-phuket_ad4f7fac877b-cb8f-bf02-1a71-60c89f89
villa|11900000|3|3|200|Phuket|Chalong|3-Bedroom Pool Villa at The Elegance by Phirunda|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-the-elegance-by-phirunda-chalong-phuket_eda5cb040571-c81f-c552-7112-ad9aa089
villa|14900000|2|2|400|Phuket|Ratsada|2-Bedroom Sea View Villa at Baan Rommai Chailay|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-or-rent-in-baan-rommai-chailay-ratsada-phuket_837b144953a9-72be-7842-958e-15e5d089
villa|34200000|3|2|294|Phuket|Patong|3-Bedroom Villa at L'Orchidee Residences|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-l-orchidee-residences-patong-phuket_982bc26ee333-51de-7682-71ec-e1e5d089
villa|76112799|3|4|241|Phuket|Kata|3-Bedroom Villa at Kata Rocks|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-kata-rocks-karon-phuket_498cd2a964e7-e130-52f2-9aaa-14e5d089
villa|40000000|4|6|485|Phuket|Nai Harn|4-Bedroom Villa at Baan Bua, Nai Harn|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-baan-bua-rawai-phuket_ee56c06b7944-811f-b0b2-dda3-41e5d089
villa|19800000|3|3|181|Phuket|Rawai|3-Bedroom Pool Villa at Kokyang Estate 1|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-kokyang-estate-1-rawai-phuket_4a9305b8dc40-25be-1632-91c8-94a8c089
villa|16000000|3|2|280|Phuket|Kamala|3-Bedroom Pool Villa near Kamala Beach|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-kamala-nathong-house-kamala-phuket_2f526baa88af-07bf-fac2-0b60-c5e5d089
villa|18900000|5|5|397|Phuket|Chalong|5-Bedroom Pool Villa at Land and House Park|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-or-rent-in-land-and-house-park-phuket-chalong-phuket_3d72f46da2c6-39a1-a382-9906-df8ac089
villa|15900000|3|4|320|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_3240463d6c63-8cbf-aac2-7613-12e5d089
villa|31000000|4|4|500|Phuket|Nai Harn|4-Bedroom Villa near Nai Harn Beach|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-baan-bua-rawai-phuket_df179edfad9b-9161-d192-0392-26e5d089
villa|80000000|3|4|390|Phuket|Pa Khlok|3-Bedroom Villa in Pa Khlok|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-pa-khlok-phuket_71121ec85cc9-8cf1-c2d2-6fcd-72a8c089
villa|16800000|3|3|180|Phuket|Cherng Talay|3-Bedroom Pool Villa in Cherng Talay|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-choeng-thale-phuket_21b9ee5b400f-3260-efd2-eba3-e6a8c089
villa|23900000|3|3|355|Phuket|Cherng Talay|3-Bedroom Mid-Century Villa in Cherng Talay|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-choeng-thale-phuket_a8a33f2a0826-f620-3ce2-12a8-d2a8c089
villa|28000000|5|5|288|Phuket|Cherng Talay|5-Bedroom Pool Villa in Cherng Talay|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-or-rent-in-choeng-thale-phuket_4ac179ac210f-d8af-0772-640a-15a8c089
villa|19900000|4|4|389|Phuket|Si Sunthon|4-Bedroom Villa at The Regent Villa Pasak|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-the-regent-villa-pasak-si-sunthon-phuket_f3171802323a-a651-b152-5942-c0e5d089
villa|25000000|2|2|230|Phuket|Si Sunthon|2-Bedroom Villa at Anchan Hills|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-in-anchan-hills-si-sunthon-phuket_8c96a71d03fa-2520-a2b2-023a-8057c089
villa|38800000|4|4|460|Phuket|Nai Harn|4-Bedroom Villa at Baan Bua, Nai Harn|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-baan-bua-rawai-phuket_b0e289452619-b80f-fab2-4b6c-9892a089
villa|75000000|5|3|1000|Phuket|Surin|5-Bedroom Villa at Baan Thai Surin Hill|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-or-rent-in-baan-thai-surin-hill-choeng-thale-phuket_5116a28f0a48-deee-3442-bdb5-91a8c089
villa|28590000|3|3|316|Phuket|Cherng Talay|3-Bedroom Villa at Riverhouse Phuket|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-riverhouse-phuket-choeng-thale-phuket_48dcab81f492-c901-c282-dd45-71e5d089
villa|18500000|3|4|362|Phuket|Si Sunthon|3-Bedroom Villa at Wallaya Villas Harmony|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-wallaya-villas-harmony-phase-2-3-si-sunthon-phuket_2e7092a169ae-a5b1-46d2-d375-304fb089
villa|15000000|3|3|180|Phuket|Kathu|3-Bedroom Villa at Loch Palm Golf Club|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-loch-palm-golf-club-kathu-phuket_255c7dec0557-c240-c5d2-b21c-72e5d089
villa|24900000|4|4|240|Phuket|Rawai|4-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-rawai-phuket_f3ada07ff08a-804e-cb02-510f-93e5d089
villa|43000000|5|4|850|Phuket|Rawai|5-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-or-rent-in-rawai-phuket_eeaa99f5ef80-baa0-7c82-9141-d1e5d089
villa|43000000|4|4|550|Phuket|Cherng Talay|4-Bedroom Villa at Botanica Luxury Villas Phase 3|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-botanica-luxury-villas-phase-3-choeng-thale-phuket_931af5709b1d-a130-a172-44ab-4cf0c089
villa|22000000|4|4|524|Phuket|Chalong|4-Bedroom Villa at 88 Land and House Hillside|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-88-land-and-house-hillside-phuket-chalong-phuket_989f1bc0b6e9-7a81-5192-2c18-7798b089
villa|32000000|4|4|300|Phuket|Rawai|4-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-rawai-phuket_865d8e3cb8da-65e0-f8e2-ce9a-a3e5d089
villa|22900000|3|3|270|Phuket|Cherng Talay|3-Bedroom Villa at Trichada Villas|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-trichada-villa-phuket-choeng-thale-phuket_c76454f77f34-f330-0092-335c-aec1a089
villa|13700000|2|2|164|Phuket|Si Sunthon|2-Bedroom Villa at MONO Luxury Villa Pasak|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-or-rent-in-mono-luxury-villa-pasak-si-sunthon-phuket_b8a8912e74a4-c60e-f632-0950-98f5a089
villa|28000000|3|3|327|Phuket|Thalang|3-Bedroom Villa at Mono Champaca|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-mono-champaca-thep-krasatti-phuket_ae87749c6bb1-f87f-8a22-11ac-844ad089
villa|25900000|3|4|203|Phuket|Layan|3-Bedroom Villa at Layan Lucky Villas Phase I|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-layan-lucky-villas-phase-i-thep-krasatti-phuket_e728e9838202-3e7f-1712-d4c8-8df4b089
villa|619000000|4|6|2400|Phuket|Kamala|4-Bedroom Oceanfront Villa at Waterfall Bay|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-waterfall-bay-kamala-phuket_2789bb370f3e-ba5e-27f2-2456-75e5d089
villa|60000000|4|5|556|Phuket|Patong|4-Bedroom Villa in Patong|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-patong-phuket_f44a5731a1ef-4950-75b2-a445-d5e5d089
villa|19950000|3|4|208|Phuket|Si Sunthon|3-Bedroom Villa at Vinzita Pool Villas|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-vinzita-pool-villas-si-sunthon-phuket_b29acde87991-118e-dd32-1f31-5ae5d089
villa|47500000|5|5|640|Phuket|Cherng Talay|5-Bedroom Villa at The Teak Phase 2|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-the-teak-phuket-phase-2-choeng-thale-phuket_b15df3be9e04-5e90-9b32-f1b0-b5e5d089
villa|45900000|4|5|473|Phuket|Cherng Talay|4-Bedroom Villa at Boat Avenue Residence|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-boat-avenue-residence-choeng-thale-phuket_b1e778e910db-2fdf-7e82-1508-b5e5d089
villa|67000000|5|6|643|Phuket|Bang Tao|5-Bedroom Villa at Botanica Bangtao Beach Phase 5|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-botanica-bangtao-beach-phase-5-choeng-thale-phuket_77e88bd7e6ed-6731-6122-b513-38ccc089
villa|25800000|4|4|266|Phuket|Nai Harn|4-Bedroom Villa at Baan Bua, Nai Harn|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-baan-bua-rawai-phuket_cd7561dac65d-e06e-d142-5f44-f3e5d089
villa|25000000|4|6|315|Phuket|Rawai|4-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-rawai-phuket_a63277461149-0251-bf62-970f-54e5d089
villa|15900000|3|4|203|Phuket|Chalong|3-Bedroom Villa at Land and Houses Park|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-land-and-house-park-phuket-chalong-phuket_18c2344c4f0a-50f1-5302-50b0-7cf0c089
villa|26800000|4|5|436|Phuket|Rawai|4-Bedroom Villa at Orbita Villa-Town|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-orbita-villa-town-rawai-phuket_17c6a600c1b9-ebb0-3482-d275-5c05a089
villa|75000000|6|8|709|Phuket|Cherng Talay|6-Bedroom Villa at Ocean Hills Phuket|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/6-bedroom-villa-for-sale-in-ocean-hills-phuket-choeng-thale-phuket_3433762bb762-432f-a152-1eda-b4e5d089
villa|20750000|3|3|240|Phuket|Rawai|3-Bedroom Villa at Marine Lily Residence|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-marine-lily-residence-rawai-phuket_ff1ceb9ae3b7-8af0-9642-fb63-ec1cc089
villa|63000000|5|6|400|Phuket|Cherng Talay|5-Bedroom Pool Villa in Cherng Talay|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-choeng-thale-phuket_9012619d7706-74e1-cc92-a2b1-f5e5d089
villa|16900000|3|2|300|Phuket|Kamala|3-Bedroom Villa in Kamala|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-kamala-phuket_3f7f1b85a6d3-22ce-3472-0c35-e5a8c089
villa|14900000|3|3|218|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_28b30c12ec7e-6b40-a6a2-0a05-b5e5d089
penthouse|34500000|2|2|307|Phuket|Patong|2-Bedroom Beachfront Residence at L'Orchidee|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-in-l-orchidee-residences-patong-phuket_c377c5ea0c07-8fee-4852-777e-6c44a089
villa|21200000|3|3|267|Phuket|Layan|3-Bedroom Villa at Two Villa Tara, Layan|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-two-villa-tara-choeng-thale-phuket_09960385a339-c841-c852-8bf7-c5e5d089
villa|20000000|3|3|230|Phuket|Pa Khlok|3-Bedroom Villa at Supalai Scenic Bay Resort|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-supalai-scenic-bay-resort-pa-khlok-phuket_f1259ed3e7cd-a56f-0fe2-76e6-45e5d089
villa|19000000|5|5|550|Phuket|Rawai|5-Bedroom Villa at Prima Villa Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-or-rent-in-prima-villa-rawai-rawai-phuket_4b1613478540-dfbe-8d72-9d9a-af70b089
villa|35000000|5|4|560|Phuket|Ratsada|5-Bedroom Pool Villa in Ratsada|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-or-rent-in-ratsada-phuket_94b97722ac40-7d20-4072-4007-85a8c089
villa|110000000|6|6|550|Phuket|Kamala|6-Bedroom Villa in Kamala|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/6-bedroom-villa-for-sale-in-kamala-phuket_2bf408811f48-cc10-de02-c942-3fe5d089
villa|20000000|3|3|195|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_03c18444c44e-3f71-f3b2-fc41-7ae5d089
villa|145000000|8|8|4800|Phuket|Rawai|Villa Resort Estate in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/36-bedroom-villa-for-sale-in-rawai-phuket_f9c653267767-953f-d692-6d86-94e5d089
villa|29250000|4|4|236|Phuket|Cherng Talay|4-Bedroom Golf-Front Villa at Laguna Links|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-laguna-links-choeng-thale-phuket_66250a8962b9-535f-0472-9d86-dceeb089
villa|26500000|3|4|380|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_1b3437875aeb-f6f0-5112-8743-a5e5d089
villa|65000000|7|8|950|Phuket|Cherng Talay|7-Bedroom Villa in Cherng Talay|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/7-bedroom-villa-for-sale-in-choeng-thale-phuket_c2bd984f49e7-8100-80c2-535b-25e5d089
villa|97000000|5|5|500|Phuket|Surin|5-Bedroom Villa Napalai at Surin Heights|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-surin-heights-choeng-thale-phuket_4722f1ce9912-f4ef-c542-873f-b5d5d089
villa|19990000|4|4|320|Phuket|Rawai|4-Bedroom Modern Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-rawai-phuket_52079edc8959-8931-2922-6120-36b49f89
villa|21900000|3|3|138|Phuket|Cherng Talay|3-Bedroom Villa at Shambhala Grand Villa|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-shambhala-grand-villa-choeng-thale-phuket_03488d7cb072-da80-9c42-f2b9-f5e5d089
villa|40000000|3|4|594|Phuket|Thalang|3-Bedroom Villa at Botanica Foresta|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-botanica-foresta-thep-krasatti-phuket_4109aec9317b-ff80-a022-b2d3-55ecd089
villa|23990000|4|3|215|Phuket|Rawai|4-Bedroom Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-rawai-phuket_a5d22e7c73d2-79fe-bbf2-eece-1ed59f89
villa|19900000|4|4|350|Phuket|Kathu|4-Bedroom Pool Villa in Kathu|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-kathu-phuket_d50ee789fac3-e16e-cae2-16c3-04e5d089
villa|55000000|5|6|773|Phuket|Surin|5-Bedroom Sea View Villa at Baan Thai Surin Hill|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-baan-thai-surin-hill-choeng-thale-phuket_69b5c0b4128f-6471-b412-60d9-5861b089
villa|25900000|3|3|660|Phuket|Pa Khlok|3-Bedroom Sea View Villa at Sunrise Ocean Villas|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-sunrise-ocean-villas-pa-khlok-phuket_b3cefded37dc-76ef-0802-31fc-55a8c089
villa|31600000|3|3|650|Phuket|Rawai|3-Bedroom Thai-Inspired Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_bc3fc1ecb320-2801-6912-476a-b4e5d089

villa|9900000|3|4|430|Koh Samui|Lamai|Luxury 3-Bedroom Pool Villa in Lamai|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ms001luxury-3-bedroom-pool-villa-in-lamai/
villa|14000000|4|3|400|Koh Samui|Chaweng|Modern 4-Bedroom Sea View Pool Villa in Chaweng|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/modern-4-bedroom-sea-view-pool-villa-for-sale-in-chaweng-b405/
villa|26900000|4|5|556|Koh Samui|Nathon|Sublime 4-Bedroom Pool Villa with Sunset Views|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph374sublime-4-bed-pool-villa-with-breath-taking-sunset-views/
villa|20900000|3|4|332|Koh Samui|Nathon|Stunning Sunset 3-Bedroom Pool Villa in Bang Makham|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph373stunning-sunset-3-bed-pool-villa-in-bang-makham/
villa|17900000|2|3|300|Koh Samui|Nathon|Modern 2-Bedroom Ocean View Pool Villa in Bang Makham|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph372modern-2-bed-ocean-view-pool-villa-in-bang-makham/
villa|11000000|2|2|330|Koh Samui|Bophut|Modern 2-Bedroom Pool Villa in Bophut|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/modern-2-bedroom-pool-villa-for-sale-in-bophut-koh-samui-b404/
villa|10500000|3|4|300|Koh Samui|Plai Laem|Elegant Boutique 3-Bedroom Pool Villa|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph371elegant-boutique-3-bed-pool-villa/
villa|12500000|3|4|300|Koh Samui|Plai Laem|Tropical 3-Bedroom Sea View Pool Villa|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph370tropical-styled-3-bed-sea-view-pool-villa/
villa|14000000|3|4|300|Koh Samui|Plai Laem|Boutique 3-Bedroom Ocean View Pool Villa|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph369boutique-3-bed-ocean-view-pool-villa/
villa|7790000|2|3|170|Koh Samui|Chaweng|Elegant Tropical 2-Bedroom Lakeside Villa|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph368elegant-tropical-2-bed-lake-side-villa/
villa|9990000|3|4|250|Koh Samui|Chaweng|3-Bedroom Lakeside Pool Villa|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph3673-bed-lake-side-pool-villa/
villa|11590000|3|4|250|Koh Samui|Chaweng|Tropical 3-Bedroom Lake Front Pool Villa|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph366tropical-designed-3-bed-lake-front-pool-villa/
villa|20450000|5|6|550|Koh Samui|Bophut|Luxury Modern 5-Bedroom Sea View Pool Villa|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph365luxury-modern-5-bed-sea-view-pool-villa/
villa|15490000|3|4|430|Koh Samui|Bophut|Contemporary 3-Bedroom Sea View Pool Villa|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph364contemporary-3-bed-sea-view-pool-villa/
villa|11500000|3|4|416|Koh Samui|Bophut|Contemporary 3/4-Bedroom Pool Villa in Prime Bophut|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph36374872/
villa|8490000|3|4|250|Koh Samui|Bophut|Contemporary 3-Bedroom Garden Pool Villa in Bophut|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph362contemporary-3-beds-garden-pool-villa-in-bophut/
villa|10500000|3|4|320|Koh Samui|Bang Por|Modern 3-Bedroom Pool Villa Steps from the Beach|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph320modern-3-bedroom-pool-villa-steps-away-from-the-beach/
villa|9950000|3|3|369|Koh Samui|Bang Rak|Brand New 3-Bedroom Pool Villa Steps from the Beach|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph360brand-new-3-bed-pool-villa-just-steps-away-from-the-beach/
villa|26900000|3|4|260|Koh Samui|Chaweng|3-Bedroom Sea View Villa in the Heart of Chaweng|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph3593-bedroom-sea-view-villa-in-the-heart-of-chaweng/
villa|33900000|4|5|400|Koh Samui|Bophut|Modern 4-Bedroom Sea View Pool Villa|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph358modern-4-bed-sea-view-pool-villa/
villa|24900000|3|4|564|Koh Samui|Lamai|Rare 3-Bedroom Gem Surrounded by Nature|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/ph35774719/
villa|8490000|2|2|255|Koh Samui|Maenam|New 2-Bedroom Tropical Pool Villa in Maenam|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/new-2-bedroom-tropical-pool-villa-for-sale-in-maenam-b403/
villa|10500000|3|3|240|Koh Samui|Lamai|Architect-Designed 3-Bedroom Pool Villa in Lamai|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/architect-designed-3-bedroom-pool-villa-for-sale-in-lamai-koh-samui-b400/
villa|38000000|5|6|958|Koh Samui|Bang Por|Luxury 5-Bedroom Sea View Pool Villa in Bang Por|Three Seasons Properties|https://three-seasons-properties.com/villa-for-sale/luxury-5-bedroom-sea-view-pool-villa-for-sale-in-bang-por-koh-samui-b401c5s/

villa|22990000|4|5|496|Hua Hin|Hin Lek Fai|4-Bedroom Villa in Hin Lek Fai|Hua Hin Property Partners|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-hin-lek-fai-prachuap-khiri-khan_da87fa8191a4-f460-0142-31b6-db519f89
villa|13900000|3|3|504|Hua Hin|Thap Tai|3-Bedroom Villa at CoCo Hua Hin 88|Hua Hin Property Partners|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-coco-hua-hin-88-thap-tai-prachuap-khiri-khan_c5e345d08b61-3940-2c12-998d-bf069f89
villa|13000000|3|3|180|Hua Hin|Hin Lek Fai|3-Bedroom Villa in Hin Lek Fai|FazWaz Hua Hin|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-hin-lek-fai-prachuap-khiri-khan_3cd97bd5c264-8dcf-5622-48ae-d5e5d089
villa|28000000|4|4|400|Hua Hin|Nong Kae|4-Bedroom Villa at White Lotus 2|FazWaz Hua Hin|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-white-lotus-2-nong-kae-prachuap-khiri-khan_4371e3d57fbf-6181-7d62-5710-02d29f89
villa|10000000|4|4|300|Hua Hin|Hua Hin Town|4-Bedroom Pool Villa at Hua Hin Panorama|FazWaz Hua Hin|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-hua-hin-panorama-hua-hin-prachuap-khiri-khan_c9b597564b07-debe-a8f2-83c7-c3419f89
villa|11800000|3|4|445|Hua Hin|Thap Tai|3-Bedroom Pool Villa at La Lua Resort|Hua Hin Property Partners|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-la-lua-resort-hua-hin-thap-tai-prachuap-khiri-khan_dd475fa9edb3-0d1f-28c2-15df-79359f89
villa|8500000|3|2|157|Hua Hin|Hua Hin Town|3-Bedroom Modern Pool Villa at Tropical Vision|FazWaz Hua Hin|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-tropical-vision-hua-hin-prachuap-khiri-khan_ccf7dbea6f54-f230-4282-4189-2d4cd089
villa|8900000|3|3|260|Hua Hin|Hua Hin Town|3-Bedroom Villa in Hua Hin City|Hua Hin Property Partners|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-hua-hin-prachuap-khiri-khan_b7a16c55e2a0-1aef-b852-c7e7-1db89f89
villa|13500000|4|3|284|Hua Hin|Thap Tai|4-Bedroom Villa in Thap Tai|Hua Hin Property Partners|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-thap-tai-prachuap-khiri-khan_abbef1b49e2a-7151-14e2-51a3-d8a29f89
villa|20000000|3|4|180|Hua Hin|Hua Hin Town|3-Bedroom Sea View Pool Villa|Hua Hin Property Partners|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-hua-hin-seaview-hua-hin-prachuap-khiri-khan_07dcb66e0095-ab7f-73b2-be27-52749f89
villa|33900000|6|4|430|Hua Hin|Hua Hin Town|6-Bedroom Villa in Hua Hin City|FazWaz Hua Hin|https://www.thailand-property.com/ads/6-bedroom-villa-for-sale-in-hua-hin-prachuap-khiri-khan_5848634366be-8d00-2c32-6b5e-26e5d089
villa|39000000|5|5|600|Hua Hin|Nong Kae|5-Bedroom Villa at BelVida Estates|Hua Hin Property Partners|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-belvida-estates-hua-hin-nong-kae-prachuap-khiri-khan_d380c975b225-b99f-6422-de8a-15e5d089
villa|12000000|4|4|600|Hua Hin|Nong Kae|4-Bedroom Villa in Nong Kae|Hua Hin Property Partners|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-nong-kae-prachuap-khiri-khan_7be6cf07be6f-ee21-d542-77f8-c5e5d089
villa|8800000|3|2|250|Hua Hin|Nong Kae|3-Bedroom Pool Villa at Sivana Gardens|Hua Hin Property Partners|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-sivana-gardens-pool-villas-nong-kae-prachuap-khiri-khan_cd0ebc1ef628-baa0-b942-726b-02839f89

villa|29900000|4|5|320|Pattaya|Jomtien|4-Bedroom Villa By Me House, Jomtien|ME House Pattaya|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-nong-prue-chonburi_7a632d07c525-c3a0-c092-66ee-b1d39f89
villa|49900000|7|9|700|Pattaya|Na Jomtien|7-Bedroom Pool Villa at Nagawari Village|One Two Solution|https://www.thailand-property.com/ads/7-bedroom-villa-for-sale-in-nagawari-village-na-jomtien-chonburi_7104481900f0-8270-ed82-369a-e665c089
villa|16000000|4|4|250|Pattaya|Jomtien|4-Bedroom Villa at Palm Oasis Pool Villas|One Two Solution|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-palm-oasis-pool-villas-nong-prue-chonburi_5a94e60ddef3-2780-0862-f429-51d3c089
villa|22900000|6|6|600|Pattaya|East Pattaya|6-Bedroom Private Luxury House at Mabprachan|Estate Ascent|https://www.thailand-property.com/ads/6-bedroom-villa-for-sale-or-rent-in-pong-chonburi_024284a0be43-c250-ed92-76e6-65e8a089
villa|16900000|4|4|310|Pattaya|East Pattaya|4-Bedroom Pool Villa at HORIZON by Patta|Raskamin Property|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-horizon-by-patta-nong-pla-lai-chonburi_4af65a132998-7aef-0a22-25af-f8b1e089
villa|16000000|3|3|352|Pattaya|Jomtien|3-Bedroom Luxury Pool Villa in Jomtien|Blue Horizon|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-nong-prue-chonburi_d19237184a11-5c50-7722-fb2b-6d279f89
villa|12900000|3|3|280|Pattaya|Na Kluea|3-Bedroom Villa at LK Village, North Pattaya|Bright Summer|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-lk-village-1-na-kluea-chonburi_78880fd66aeb-dc7f-d092-b8f2-be9ab089
villa|27900000|5|6|578|Pattaya|Na Jomtien|5-Bedroom Pool Villa at Nagawari, Na Jomtien|Estate Ascent|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-or-rent-in-nagawari-villa-na-jomtien-chonburi_2dc972e087db-4b71-a252-a448-6d3fb089
villa|26900000|4|5|420|Pattaya|Jomtien|4-Bedroom Pool Villa ZENARA|Design Corner|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-nong-prue-chonburi_786f926b9120-daee-0ab2-63c5-fd44b089
villa|29900000|4|4|559|Pattaya|East Pattaya|4-Bedroom Villa at Charin Pattaya|AT Home Real Estate|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-charin-pattaya-nong-prue-chonburi_6c25c8c5d310-8300-d412-3dc7-ef45b089
villa|12000000|3|4|390|Pattaya|East Pattaya|3-Bedroom Modern Pool Villa in Huay Yai|Kaplish Estate|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-huai-yai-chonburi_219c0254a16d-7aaf-feb2-f191-d29ae089
villa|16650000|4|5|310|Pattaya|East Pattaya|4-Bedroom Villa in Huai Yai|FazWaz Pattaya|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-huai-yai-chonburi_05a4210701e8-7f5f-b3b2-8b21-d4e5d089
villa|23900000|5|5|480|Pattaya|Jomtien|5-Bedroom Villa at Palm Oasis Villas|PropertyScout|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-palm-oasis-pool-villas-nong-prue-chonburi_586d6aa950d2-9fd1-6652-6957-2c179f89
villa|23576000|4|6|421|Pattaya|East Pattaya|4-Bedroom Villa at Lumina Luxury|PropertyScout|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-nong-prue-chonburi_2596272e6220-d9d0-8a82-0997-e612b089
villa|22000000|4|4|500|Pattaya|East Pattaya|4-Bedroom Villa at Paradise Villa|AT Home Real Estate|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-paradise-villa-1-nong-prue-chonburi_de603b2cdf06-d581-f412-4473-148da089
villa|14900000|3|3|400|Pattaya|Jomtien|3-Bedroom House at Jomtien Garden|Casa Pattaya|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-jomtien-garden-village-nong-prue-chonburi_475a7f02fe95-9f0e-a782-b032-d638b089
villa|11000000|3|3|207|Pattaya|East Pattaya|3-Bedroom Villa at Celestial, Mabprachan Lake|DDA Real Estate|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-celestial-villa-pattaya-nong-prue-chonburi_7d4aeea874fa-ddd0-9762-7d69-7265c089

condo|36700000|2|2|147|Bangkok|Thonglor|2-Bedroom Residence at La Citta Delre, Thonglor 16|Thailand-Property (FazWaz Bangkok)|https://www.thailand-property.com/ads/2-bedroom-condo-for-sale-in-la-citta-delre-thonglor-16-khlong-tan-nuea-bangkok_dea759768e5f-8800-c402-f555-5840c089
condo|20500000|2|2|83|Bangkok|Phrom Phong|2-Bedroom Condo at The XXXIX by Sansiri|Thailand-Property (108Siam)|https://www.thailand-property.com/ads/2-bedroom-condo-for-sale-in-the-xxxix-by-sansiri-khlong-tan-nuea-bangkok-near-bts-phrom-phong_07f27c12e739-28fe-5462-b459-95a8c089
condo|185000000|3|3|354|Bangkok|Silom|3-Bedroom Residence at The Ritz-Carlton Residences, MahaNakhon|RICHMONT'S International|https://www.thailand-property.com/ads/3-bedroom-condo-for-sale-in-the-ritz-carlton-residences-at-mahanakhon-silom-bangkok-near-bts-chong-nonsi_37119412fb12-3fc0-1e82-400b-58f19f89
condo|19000000|1|1|49|Bangkok|Thonglor|1-Bedroom Condo at KHUN by YOO inspired by Starck|Thailand-Property (FazWaz Bangkok)|https://www.thailand-property.com/ads/1-bedroom-condo-for-sale-in-khun-by-yoo-inspired-by-starck-khlong-tan-nuea-bangkok-near-bts-thong-lo_3f69280e2567-2791-de02-1b10-f4d5d089
condo|12900000|2|2|177|Phuket|Yamu|2-Bedroom Condo at Baan Yamu Residences|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/2-bedroom-condo-for-sale-in-baan-yamu-residences-pa-khlok-phuket_29e0f7b3bdbe-181f-3602-776e-da239f89
condo|12000000|2|2|154|Phuket|Karon|2-Bedroom Condo at The View Phuket, Karon|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/2-bedroom-condo-for-sale-or-rent-in-the-view-phuket-karon-phuket_2718e8626aff-9360-30c2-07c4-7533c089

villa|18703000|2|1|114|Phuket|Chalong|2-Bedroom Villa at Villa Zolitude|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-in-villa-zolitude-chalong-phuket_88eb796d1f09-4b00-98b2-4012-b20db089
villa|149000000|2|3|590|Phuket|Cherng Talay|2-Bedroom Villa at Trisara|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-in-trisara-choeng-thale-phuket_5b7d0995a2ff-64a0-3402-093b-28d6a089
villa|64950000|4|6|555|Phuket|Thalang|4-Bedroom Villa at Botanica Foresta|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-botanica-foresta-thep-krasatti-phuket_402d32ccae85-7e8f-a242-716c-00a8c089
villa|27000000|6|6|350|Phuket|Cherng Talay|6-Bedroom Villa in Cherng Talay|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/6-bedroom-villa-for-sale-in-choeng-thale-phuket_2a4523eafdba-7c20-e332-eb29-f2e5d089
villa|11900000|3|3|283|Phuket|Rawai|3-Bedroom Villa at Oxygen Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-oxygen-condominium-rawai-rawai-phuket_c07d1efa20b0-505e-9082-03a2-84e5d089
villa|12900000|4|5|191|Phuket|Rawai|4-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-rawai-phuket_2def96431978-6510-1a62-3e55-0860b089
villa|29999000|5|6|315|Phuket|Si Sunthon|5-Bedroom Pool Villa in Si Sunthon|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-si-sunthon-phuket_8441139fe86b-719f-5d32-972b-b3e5d089
villa|12750000|6|3|470|Phuket|Rawai|6-Bedroom Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/6-bedroom-villa-for-sale-in-rawai-phuket_3bc32adfd6a7-7170-e432-8b6a-2235a089
villa|24500000|3|3|230|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-rawai-phuket_05ffc46388cc-1c0f-5872-88f3-91e5d089
villa|27900000|3|3|221|Phuket|Si Sunthon|3-Bedroom Villa at Trichada Azure|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-trichada-azure-si-sunthon-phuket_a7e4834d5fb9-0a4f-fd12-0ad1-96e29f89
villa|39000000|4|5|315|Phuket|Rawai|4-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-rawai-phuket_e26678bea7e1-a961-9b02-a565-6879b089
villa|20000000|3|3|374|Phuket|Si Sunthon|3-Bedroom Villa at LuxPride by Wallaya|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-luxpride-by-wallaya-villas-si-sunthon-phuket_6d45cc49e7c8-0640-9a32-2d34-f836a089
villa|16800000|3|3|328|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-rawai-phuket_84d3b8b3bc24-cf40-18a2-6328-d3e5d089
villa|15500000|4|4|378|Phuket|Si Sunthon|4-Bedroom Villa at Wallaya Villas Harmony|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-wallaya-villas-harmony-si-sunthon-phuket_15614df2a657-a86f-9a02-3cce-3e99b089
villa|19200000|2|2|114|Phuket|Chalong|2-Bedroom Villa at Villa Zolitude|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-in-villa-zolitude-chalong-phuket_fde54623588a-7abe-4d52-bb9c-b11aa089
villa|21990000|5|5|700|Phuket|Pa Khlok|5-Bedroom Villa at Sunrise Ocean Villas|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-sunrise-ocean-villas-pa-khlok-phuket_c645a217c0f4-d2f1-3a82-7f7a-85a8c089
villa|13900000|2|2|180|Phuket|Pa Khlok|2-Bedroom Pool Villa in Pa Khlok|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-or-rent-in-pa-khlok-phuket_c9f86cf5772d-6330-4302-fc73-fbd39f89
villa|13900000|2|2|262|Phuket|Rawai|2-Bedroom Villa at Villa Suksan|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-in-villa-suksan-soi-king-suksan-4-rawai-phuket_e45a37b92598-ed61-4362-874a-94a8c089
villa|18672780|3|4|445|Phuket|Rawai|3-Bedroom Villa at Villa De Valley|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-villa-de-valley-rawai-phuket_fbeeaa02dc07-a2ce-b462-98ad-65a8c089
villa|139684314|4|6|1513|Phuket|Kamala|4-Bedroom Villa at Andara Resort and Villas|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-andara-resort-and-villas-kamala-phuket_5dd555f3406a-7cdf-4b52-e7fd-84e5d089
villa|18900000|4|3|422|Phuket|Si Sunthon|4-Bedroom Villa in Si Sunthon|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-si-sunthon-phuket_d2a2ec519192-0b3e-9b02-ef13-3de5d089
villa|16900000|3|3|180|Phuket|Patong|3-Bedroom Villa in Patong|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-patong-phuket_bfbd85d82a86-854f-8892-1adf-5b42d089
villa|16500000|4|3|424|Phuket|Kathu|4-Bedroom Villa at Loch Palm Golf Club|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-loch-palm-golf-club-kathu-phuket_7ce0fdb1f87a-daa1-afe2-16ad-948ac089
villa|26700000|3|3|320|Phuket|Si Sunthon|3-Bedroom Villa at Botanica Modern Loft II|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-botanica-modern-loft-ii-si-sunthon-phuket_d8f81ac00f91-ee90-5e82-5d4f-f853a089
villa|49900000|4|4|533|Phuket|Cherng Talay|4-Bedroom Villa at Erawana Grand|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-erawana-grand-choeng-thale-phuket_589e45b6d2ef-5421-2bd2-a63b-f755b089
villa|28200000|5|5|345|Phuket|Chalong|5-Bedroom Villa at Baan Chalong Residences|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-baan-chalong-residences-chalong-phuket_931aaa5fe420-ecff-5222-e7b7-ef57b089
villa|15000000|3|3|300|Phuket|Kamala|3-Bedroom Villa at Kamala Paradise|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-kamala-paradise-kamala-phuket_76ab60b4ced5-15ee-a712-ab23-ba6ab089
villa|24800000|4|5|324|Phuket|Rawai|4-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-rawai-phuket_030c70a8a5ba-042e-df82-7f8d-6443b089
villa|12000000|2|2|117|Phuket|Kamala|2-Bedroom Villa at NaMara Residences|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-in-namara-the-residences-phuket-kamala-phuket_7b09ba41b0dc-7dd1-1682-bbad-6b53a089
villa|19999999|3|3|175|Phuket|Cherng Talay|3-Bedroom Villa at Villoft Zen Living|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-villoft-zen-living-choeng-thale-phuket_68dacedae0ef-c2b1-1962-5c7c-44789f89
villa|59999999|4|5|780|Phuket|Kathu|4-Bedroom Pool Villa at Baan Cocoon|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-baan-cocoon-kathu-phuket_f27b84bd1abd-d80f-ae82-2820-9903b089
villa|40000000|4|5|600|Phuket|Nai Harn|4-Bedroom Villa at Baan Bua, Nai Harn|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-baan-bua-rawai-phuket_f54b6fef0934-4310-f0c2-65aa-68ebb089
villa|57000000|4|5|600|Phuket|Rawai|4-Bedroom Architect-Designed Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-rawai-phuket_e8dbb460f946-2e50-2cd2-1332-34e5d089
villa|25400000|3|3|406|Phuket|Thalang|3-Bedroom Villa at Asherah Villas|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-asherah-villas-phuket-thep-krasatti-phuket_0464cbbebfe2-cd1f-2ab2-f3a8-b4e5d089
villa|17600000|3|3|212|Phuket|Chalong|3-Bedroom Pool Villa in Chalong|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-chalong-phuket_3085c5d19a7a-d17e-2932-d8e4-23e5d089
villa|19999999|3|3|200|Phuket|Si Sunthon|3-Bedroom Villa in Si Sunthon|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-si-sunthon-phuket_d8ee279e2be3-4d01-db52-5240-1fe5d089
villa|21714000|3|3|365|Phuket|Karon|3-Bedroom Sea View Villa at Hightone Karon|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-hightone-karon-seaview-villas-garden-karon-phuket_1a1f0c1bdccd-e87e-31d2-0813-033fb089
villa|22500000|3|3|310|Phuket|Thalang|3-Bedroom Villa at Asherah Villas|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-asherah-villas-phuket-thep-krasatti-phuket_660bbd928746-c14f-5e02-9c19-696ea089
villa|49000000|4|5|376|Phuket|Cherng Talay|4-Bedroom Villa at Ocean Hills Phuket|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-ocean-hills-phuket-choeng-thale-phuket_0cb0fc0eb43f-c8d1-d062-ff18-31e5d089
villa|36000000|5|6|1030|Phuket|Chalong|5-Bedroom Tuscan-Style Villa in Chalong|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-or-rent-in-chalong-phuket_3c290f8b9a5a-e40f-e922-7a59-75e5d089
villa|14900000|3|3|200|Phuket|Si Sunthon|3-Bedroom Modern Villa in Si Sunthon|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-si-sunthon-phuket_e579c2113c6c-c6e0-cf32-08ef-5a09c089
villa|59325000|6|7|449|Phuket|Karon|6-Bedroom Villa in Karon|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/6-bedroom-villa-for-sale-in-karon-phuket_a5c8e0547ee3-cb30-0912-e9fa-e6a8c089
villa|20500000|3|2|242|Phuket|Rawai|3-Bedroom Villa at Raintree Villa|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-raintree-villa-rawai-phuket_8ed8bd7835e4-eb61-7152-6f3b-19d5d089
villa|33900000|3|3|370|Phuket|Nai Thon|3-Bedroom Villa at Vista Del Mar|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-vista-del-mar-phuket-sakhu-phuket_3a25026fd4d5-abc1-8852-8e2c-b487b089

villa|12800000|3|3|350|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_8a9e154c03d9-b9a0-e262-370b-34e5d089
villa|11000000|3|4|225|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_681e538e60e4-1a30-0802-d8e8-830fc089
villa|28000000|4|5|293|Phuket|Rawai|4-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-rawai-phuket_5267feb39472-9bef-2e72-0c68-52eeb089
villa|35500000|3|4|500|Phuket|Ko Kaeo|3-Bedroom Villa at Fortuna Lakeside|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-fortuna-lakeside-ko-kaeo-phuket_d1164db24a63-fa4e-5322-5f83-2299c089
villa|22890000|3|3|266|Phuket|Cherng Talay|3-Bedroom Villa at Tanode Estate|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-tanode-estate-choeng-thale-phuket_744b7410423c-c17f-db52-8946-7df0c089
villa|20500000|4|5|280|Phuket|Rawai|4-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-rawai-phuket_f012d26802cc-ec5f-f312-7bb5-cd01a089
villa|17000000|3|2|150|Phuket|Kamala|3-Bedroom Villa at Kamala Garden View|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-kamala-garden-view-kamala-phuket_399f2e53f727-e5b0-8272-a77b-01e5d089
villa|265000000|3|3|1585|Phuket|Cherng Talay|3-Bedroom Villa at Trisara|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-trisara-choeng-thale-phuket_94e7a493d9b2-3ab1-fa32-7e2f-dceda089
villa|25000000|3|4|403|Phuket|Si Sunthon|3-Bedroom Villa at Menara Hills|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-the-menara-hill-si-sunthon-phuket_dc8acc847732-a4f0-f492-b103-f4e5d089
villa|18900000|3|3|250|Phuket|Pa Khlok|3-Bedroom Villa at Orchid Lane, Mission Hills|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-orchid-lane-mission-hill-pa-khlok-phuket_38c284228352-45c1-4d92-4bb9-65a8c089
villa|15000000|3|4|160|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_894b53c16203-0fef-0492-980a-5da6b089
villa|19900000|3|4|225|Phuket|Karon|3-Bedroom Villa in Karon|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-karon-phuket_0fe93fdbe4a1-b810-6ef2-767f-24e5d089
villa|64000000|11|9|920|Phuket|Rawai|11-Bedroom Estate in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/11-bedroom-villa-for-sale-in-rawai-phuket_5f46db82c83f-ae00-4a02-92ae-64e5d089
villa|23000000|4|4|383|Phuket|Layan|4-Bedroom Villa at Two Villas Tara|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-two-villa-tara-choeng-thale-phuket_7e1e1b4aed27-af51-34b2-a4e2-cc7fa089
villa|12500000|3|3|350|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_a7f3c0c51bc5-9fdf-b7a2-0898-55e5d089
villa|53100000|5|5|579|Phuket|Ko Kaeo|5-Bedroom Villa at Fortuna Lakeside|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-fortuna-lakeside-ko-kaeo-phuket_f57fc7bfa597-c331-64b2-93c0-2a15c089
villa|24000000|3|4|189|Phuket|Cherng Talay|3-Bedroom Villa at Orchard Villas Pasak 3|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-orchard-villas-pasak-3-choeng-thale-phuket_be8179d332d0-84be-2602-0b45-45e5d089
villa|11900000|4|4|250|Phuket|Ko Kaeo|4-Bedroom Villa at Phuket Villa 2|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-phuket-villa-2-wichit-phuket_16bd931f1bcd-1b01-a2c2-727c-adb99f89
villa|17900000|3|3|203|Phuket|Si Sunthon|3-Bedroom Villa at The Pak Pool Villa|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-the-pak-pool-villa-si-sunthon-phuket_82f61fe6a7b7-0171-db62-5f0c-bbc2a089
villa|55000000|3|3|542|Phuket|Rawai|3-Bedroom Luxury Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_3590c521f400-e24f-d4e2-fc3b-84e5d089
villa|39900000|5|5|460|Phuket|Kathu|5-Bedroom Villa at Phuket Country Club|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-phuket-country-club-kathu-phuket_4e72832355e5-8511-5db2-7f34-d7b7b089
villa|65000000|3|4|300|Phuket|Pa Khlok|3-Bedroom Villa in Pa Khlok|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-pa-khlok-phuket_5755e00dc86c-bd7e-a342-719f-f4a8c089
villa|27300000|4|4|288|Phuket|Si Sunthon|4-Bedroom Villa at Alisa Pool Villa|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-alisa-pool-villa-si-sunthon-phuket_08a27aa8ace3-da7e-03e2-ac2b-43b3a089
villa|12400000|3|2|300|Phuket|Rawai|3-Bedroom Villa at Samakee Village|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-samakee-village-rawai-phuket_181d0e9ceac5-2b31-b382-4128-853ad089
villa|11500000|2|2|220|Phuket|Rawai|2-Bedroom Villa at Villa Suksan|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-in-villa-suksan-soi-king-suksan-4-rawai-phuket_3492e10240f0-56c1-29e2-4ffc-52a8c089
villa|35000000|4|5|455|Phuket|Si Sunthon|4-Bedroom Villa at Anchan Hills|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-anchan-hills-si-sunthon-phuket_5f623e651d32-09e1-ec42-a2ef-a20db089
villa|25000000|3|4|290|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-rawai-phuket_fee5d494f312-d651-8582-a045-74e5d089
villa|69000000|5|6|400|Phuket|Karon|5-Bedroom Sea View Villa in Karon|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-karon-phuket_4fd9fc9261f0-a321-44c2-94fe-8de5d089
villa|23500000|4|3|288|Phuket|Layan|4-Bedroom Villa at Layan Lucky Villas|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-layan-lucky-villas-phase-i-thep-krasatti-phuket_a4bb79a3eed7-688f-cb32-a575-da7ea089
villa|24500000|3|3|226|Phuket|Rawai|3-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-rawai-phuket_3fc4e722898e-7ace-a6a2-4261-90e5d089
villa|15900000|2|2|275|Phuket|Rawai|2-Bedroom Pool Villa in Rawai|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-in-rawai-phuket_024878028eb1-1c8f-80f2-4539-77c79f89
villa|52000000|3|3|355|Phuket|Patong|3-Bedroom Villa at L'Orchidee Residences|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-l-orchidee-residences-patong-phuket_9482fd2eb96c-541e-e1c2-02f1-7d04a089
villa|11500000|3|2|226|Phuket|Chalong|3-Bedroom Villa at Land and House Park|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-land-and-house-park-phuket-chalong-phuket_e6ddaf6adac2-6751-8642-799a-b2a8c089
villa|18900000|3|3|222|Phuket|Karon|3-Bedroom Villa in Karon|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-karon-phuket_c3a42e67c940-7cee-6ae2-3018-05a8c089
villa|25995000|3|5|280|Phuket|Thalang|3-Bedroom Villa in Thep Krasatti|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-thep-krasatti-phuket_61cbec688a70-5d3e-c072-56b2-80e5d089
villa|26000000|4|4|450|Phuket|Chalong|4-Bedroom Villa at Land and House Park|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-land-and-house-park-phuket-chalong-phuket_87c0e6e77ac7-9dcf-e4c2-ef9f-62eeb089
villa|24000000|4|4|269|Phuket|Thalang|4-Bedroom Villa in Thep Krasattri|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-thep-krasatti-phuket_75cd3a3d8513-592e-be02-3adb-14e5d089
villa|68000000|4|5|592|Phuket|Cherng Talay|4-Bedroom Villa at Laguna Homes|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-laguna-homes-choeng-thale-phuket_05b3c785ad8d-e301-ebc2-5200-34e5d089
penthouse|35900000|2|2|294|Phuket|Patong|2-Bedroom Residence at L'Orchidee, Patong|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-in-l-orchidee-residences-patong-phuket_58f1b4b41319-6b1f-8c12-714e-6c44a089
villa|37639000|4|5|431|Phuket|Chalong|4-Bedroom Villa at Botanica Chalong Bay|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-botanica-chalong-bay-chalong-phuket_1c75afdf45af-46e0-19c2-5d34-15a8c089
villa|17900000|4|5|380|Phuket|Si Sunthon|4-Bedroom Villa at Permsap Villa|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-or-rent-in-permsap-villa-si-sunthon-phuket_db8b74139722-db9e-2092-9f5c-bae5d089
villa|45500000|3|5|390|Phuket|Si Sunthon|3-Bedroom Villa at Manick Hillside|Thailand-Property (FazWaz Phuket)|https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-manick-hillside-si-sunthon-phuket_f0bebd78d122-3bae-b102-c7b5-e1e5d089
villa|20900000|4|5|525|Phuket|Chalong|4-Bedroom Villa at 99 Phuket Andaman|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-99-phuket-andaman-tropical-home-chalong-phuket_ca1a2627b0d2-7120-1832-e7ba-e4aba089
villa|40000000|5|6|600|Phuket|Rawai|5-Bedroom Pool Villa in Rawai|Thailand-Property (LivePhuket)|https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-rawai-phuket_55d1c4223c14-6d61-4c72-5b3c-b3e5d089
`.trim();

export type BulkListing = {
  externalId: string;
  propertyType: string;
  priceAmount: number;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  province: string;
  city: string;
  district: string;
  title: string;
  agencyName: string;
  agencyUrl: string;
};

const PROVINCE_BY_CITY: Record<string, string> = {
  Phuket: "Phuket",
  "Koh Samui": "Surat Thani",
  Pattaya: "Chonburi",
  "Hua Hin": "Prachuap Khiri Khan",
  Bangkok: "Bangkok",
  "Chiang Mai": "Chiang Mai",
};

export function parseBulk(): BulkListing[] {
  const seen = new Set<string>();
  const out: BulkListing[] = [];
  for (const line of RAW.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const [type, price, bd, ba, sqm, city, district, title, agencyName, url] =
      t.split("|");
    if (!url) continue;
    // externalId = the trailing id segment of the URL
    const idMatch = url.match(/_([a-f0-9-]+)$/i);
    const externalId = idMatch
      ? idMatch[1]
      : url.split("/").filter(Boolean).pop()!.slice(0, 80);
    if (seen.has(externalId)) continue;
    seen.add(externalId);
    out.push({
      externalId,
      propertyType: type.trim(),
      priceAmount: Number(price),
      bedrooms: bd && Number(bd) ? Number(bd) : null,
      bathrooms: ba && Number(ba) ? Number(ba) : null,
      areaSqm: sqm && Number(sqm) ? Number(sqm) : null,
      province: PROVINCE_BY_CITY[city.trim()] ?? "Phuket",
      city: city.trim(),
      district: district.trim(),
      title: title.trim(),
      agencyName: agencyName.trim(),
      agencyUrl: url.trim(),
    });
  }
  return out;
}
