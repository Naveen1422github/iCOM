import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from "@ionic/react";

// Define the product type
interface Product {
  id: number;
  name: string;
  code: string;
  price: number;
  img: string;
  description: string;
  stockStatus: string;
  rating: number;
  category: string;
  reviews: {
    username: string;
    comment: string;
    rating: number;
  }[];
}

interface RouteParams {
  category: string;
}

const products: Product[] = [
    {
      "id": 6,
      "name": "Boyfriend Tee - Women",
      "code": "₹1206",
      "price": 20.99,
      "img": "https://images.bewakoof.com/uploads/grid/app/desktop-boyfriend-tee-women-1729006649.jpg",
      "description": "A casual boyfriend tee perfect for a relaxed look. Made from soft fabric for all-day comfort.",
      "stockStatus": "In Stock",
      "rating": 4.5,
      "category": "Women",
      "reviews": [
        {
          "username": "ChrisH",
          "comment": "Very comfortable and stylish.",
          "rating": 5
        },
        {
          "username": "KellyJ",
          "comment": "A bit oversized but looks great.",
          "rating": 4
        }
      ]
    },
    {
      "id": 29,
      "name": "Men S Beige Grey Batman Ombre Oversized T Shirt 617004 1718803064 1",
      "code": "₹1100",
      "price": 20,
      "img": "https://images.bewakoof.com/t320/men-s-beige-grey-batman-ombre-oversized-t-shirt-617004-1718803064-1.jpg",
      "description": "A stylish and comfortable piece for everyday wear.",
      "stockStatus": "In Stock",
      "rating": 4.5,
      "category": "Men",
      "reviews": [
        {
          "username": "UserA",
          "comment": "Great product, really comfortable.",
          "rating": 5
        },
        {
          "username": "UserB",
          "comment": "Good fit, but could use better material.",
          "rating": 4
        }
      ]
    },
    {
      "id": 7,
      "name": "Cargos - Women",
      "code": "₹1207",
      "price": 30.99,
      "img": "https://images.bewakoof.com/uploads/grid/app/desktop-cargos-women-1729006650.jpg",
      "description": "Stylish and comfortable cargos, great for everyday wear and outdoor adventures.",
      "stockStatus": "Low Stock",
      "rating": 4.2,
      "category": "Women",
      "reviews": [
        {
          "username": "AnnaB",
          "comment": "Very practical and comfy.",
          "rating": 4
        },
        {
          "username": "NinaL",
          "comment": "Love the color and fit!",
          "rating": 5
        }
      ]
    },
    {
      "id": 8,
      "name": "Dresses - Women",
      "code": "₹1208",
      "price": 40.50,
      "img": "https://images.bewakoof.com/uploads/grid/app/desktop-dresses-women-1729006649.jpg",
      "description": "Chic and comfortable dresses, perfect for a casual day out or a special event.",
      "stockStatus": "In Stock",
      "rating": 4.6,
      "category": "Women",
      "reviews": [
        {
          "username": "EmmaR",
          "comment": "Loved the style and material.",
          "rating": 5
        },
        {
          "username": "LisaM",
          "comment": "Fits well but a bit long.",
          "rating": 4
        }
      ]
    },
    {
      "id": 9,
      "name": "Hoodies - Women",
      "code": "₹1209",
      "price": 35.99,
      "img": "https://images.bewakoof.com/uploads/grid/app/desktop-hoodies-women--1--1729006650.jpg",
      "description": "Soft and cozy hoodies, perfect for a casual day or cool evenings.",
      "stockStatus": "In Stock",
      "rating": 4.8,
      "category": "Women",
      "reviews": [
        {
          "username": "OliviaP",
          "comment": "Warm and comfy, great for layering.",
          "rating": 5
        },
        {
          "username": "SophiaK",
          "comment": "A bit big but still love it.",
          "rating": 4
        }
      ]
    },
    {
      "id": 30,
      "name": "Men S Beige Straight Fit Cargo Pants 628753 1727429612 1",
      "code": "₹1200",
      "price": 25,
      "img": "https://images.bewakoof.com/t320/men-s-beige-straight-fit-cargo-pants-628753-1727429612-1.jpg",
      "description": "A stylish and comfortable piece for everyday wear.",
      "stockStatus": "In Stock",
      "rating": 4.0,
      "category": "Men",
      "reviews": [
        {
          "username": "UserA",
          "comment": "Great product, really comfortable.",
          "rating": 5
        },
        {
          "username": "UserB",
          "comment": "Good fit, but could use better material.",
          "rating": 4
        }
      ]
    },
    {
      "id": 31,
      "name": "Men S Black Need Space Snoopy Graphic Printed Oversized T Shirt 630667 1719838040 1",
      "code": "₹1300",
      "price": 30,
      "img": "https://images.bewakoof.com/t320/men-s-black-need-space-snoopy-graphic-printed-oversized-t-shirt-630667-1719838040-1.jpg",
      "description": "A stylish and comfortable piece for everyday wear.",
      "stockStatus": "In Stock",
      "rating": 4.5,
      "category": "Men",
      "reviews": [
        {
          "username": "UserA",
          "comment": "Great product, really comfortable.",
          "rating": 5
        },
        {
          "username": "UserB",
          "comment": "Good fit, but could use better material.",
          "rating": 4
        }
      ]
    },
    {
      "id": 32,
      "name": "Men S Black Wander Geometry T Shirt 391326 1717060371 1",
      "code": "₹1400",
      "price": 35,
      "img": "https://images.bewakoof.com/t320/men-s-black-wander-geometry-t-shirt-391326-1717060371-1.jpg",
      "description": "A stylish and comfortable piece for everyday wear.",
      "stockStatus": "In Stock",
      "rating": 4.0,
      "category": "Men",
      "reviews": [
        {
          "username": "UserA",
          "comment": "Great product, really comfortable.",
          "rating": 5
        },
        {
          "username": "UserB",
          "comment": "Good fit, but could use better material.",
          "rating": 4
        }
      ]
    },
    {
      "id": 33,
      "name": "Men S Green Loki Graphic Printed Oversized Acid Wash T Shirt 648728 1728291319 1",
      "code": "₹1500",
      "price": 40,
      "img": "https://images.bewakoof.com/t320/men-s-green-loki-graphic-printed-oversized-acid-wash-t-shirt-648728-1728291319-1.jpg",
      "description": "A stylish and comfortable piece for everyday wear.",
      "stockStatus": "In Stock",
      "rating": 4.5,
      "category": "Men",
      "reviews": [
        {
          "username": "UserA",
          "comment": "Great product, really comfortable.",
          "rating": 5
        },
        {
          "username": "UserB",
          "comment": "Good fit, but could use better material.",
          "rating": 4
        }
      ]
    },
    {
      "id": 34,
      "name": "Men S Green Move On Graphic Printed T Shirt 587160 1717061149 1",
      "code": "₹1600",
      "price": 45,
      "img": "https://images.bewakoof.com/t320/men-s-green-move-on-graphic-printed-t-shirt-587160-1717061149-1.jpg",
      "description": "A stylish and comfortable piece for everyday wear.",
      "stockStatus": "In Stock",
      "rating": 4.0,
      "category": "Men",
      "reviews": [
        {
          "username": "UserA",
          "comment": "Great product, really comfortable.",
          "rating": 5
        },
        {
          "username": "UserB",
          "comment": "Good fit, but could use better material.",
          "rating": 4
        }
      ]
    },
    {
      "id": 35,
      "name": "Printed Cotton T-Shirt",
      "code": "₹1500",
      "price": 30,
      "img": "https://assets.myntassets.com/f_webp,h_560,q_90,w_420/v1/assets/images/28230544/2024/3/13/c00d1a90-00c9-47c5-9c16-3eec91c3a1071710302012409PrintedcottonT-shirt1.jpg",
      "description": "Classic printed cotton t-shirt with a trendy design.",
      "stockStatus": "In Stock",
      "category": "Kids",
      "rating": 4.5,
      "reviews": [
        {
          "username": "AliceD",
          "comment": "Great quality and fits my kid perfectly.",
          "rating": 5
        },
        {
          "username": "JohnK",
          "comment": "Nice material but runs a bit small.",
          "rating": 4
        }
      ]
    },
    {
      "id": 36,
      "name": "Printed Cotton T-Shirt",
      "code": "₹1200",
      "price": 25,
      "img": "https://assets.myntassets.com/f_webp,h_560,q_90,w_420/v1/assets/images/28419090/2024/3/22/fa7492f6-9238-4146-bf6d-b7eb8ae469721711086277213PrintedcottonT-shirt1.jpg",
      "description": "Stylish and comfortable printed t-shirt for casual wear.",
      "stockStatus": "In Stock",
      "category": "Kids",
      "rating": 4.0,
      "reviews": [
        {
          "username": "MichaelP",
          "comment": "Good for everyday wear but fades a little after washing.",
          "rating": 3.5
        },
        {
          "username": "SarahG",
          "comment": "Loved it! My kid enjoys wearing it.",
          "rating": 4.5
        }
      ]
    },
    {
      "id": 37,
      "name": "Printed Cotton T-Shirt",
      "code": "₹1400",
      "price": 35,
      "img": "https://assets.myntassets.com/f_webp,h_560,q_90,w_420/v1/assets/images/28528286/2024/3/27/f0f7cce1-3aa2-4cfb-9400-0f5e1b3c4c991711522087025PrintedcottonT-shirt1.jpg",
      "description": "Printed t-shirt made with high-quality cotton for everyday comfort.",
      "stockStatus": "In Stock",
      "category": "Kids",
      "rating": 4.2,
      "reviews": [
        {
          "username": "LucyH",
          "comment": "Nice shirt, but could be softer.",
          "rating": 4
        },
        {
          "username": "TomF",
          "comment": "Loved the design, my kid is a fan!",
          "rating": 4.5
        }
      ]
    },
    {
      "id": 38,
      "name": "Printed Cotton T-Shirt",
      "code": "₹1300",
      "price": 30,
      "img": "https://assets.myntassets.com/f_webp,h_560,q_90,w_420/v1/assets/images/28528290/2024/3/27/e1852b74-cb3a-44d1-97d1-65c3fd982caa1711523487200PrintedcottonT-shirt1.jpg",
      "description": "Trendy printed cotton t-shirt with a soft feel.",
      "stockStatus": "In Stock",
      "category": "Kids",
      "rating": 4.3,
      "reviews": [
        {
          "username": "EmmaS",
          "comment": "Love the print, feels comfortable.",
          "rating": 4.5
        },
        {
          "username": "DavidT",
          "comment": "Good product but a bit overpriced.",
          "rating": 4
        }
      ]
    },
    {
      "id": 39,
      "name": "HM Boys Black Cotton T-shirt",
      "code": "₹1800",
      "price": 40,
      "img": "https://assets.myntassets.com/f_webp,h_560,q_90,w_420/v1/assets/images/10376853/2021/3/4/632718d0-f5d9-48fb-8878-4cac920d0fe21614847223216-HM-Boys-Black-Cotton-T-shirt-1371614847222749-1.jpg",
      "description": "Black cotton t-shirt designed for boys, perfect for casual wear.",
      "stockStatus": "In Stock",
      "category": "Kids",
      "rating": 4.7,
      "reviews": [
        {
          "username": "SamB",
          "comment": "High quality, durable material.",
          "rating": 5
        },
        {
          "username": "LindaW",
          "comment": "Perfect for my son, he loves it.",
          "rating": 4.8
        }
      ]
    },
   
    {
      "id": 41,
      "name": "Long Sleeved T-Shirt",
      "code": "₹1900",
      "price": 50,
      "img": "https://assets.myntassets.com/f_webp,h_560,q_90,w_420/v1/assets/images/27726124/2024/2/20/d8beab62-2c85-4560-878d-531a871a90091708433609582Long-sleevedT-shirt1.jpg",
      "description": "Long sleeved t-shirt made from premium quality cotton.",
      "stockStatus": "In Stock",
      "category": "Kids",
      "rating": 4.6,
      "reviews": [
        {
          "username": "SophiaR",
          "comment": "Perfect for cooler weather, my kid loves it.",
          "rating": 4.8
        },
        {
          "username": "HenryV",
          "comment": "Good quality but a bit expensive.",
          "rating": 4.4
        }
      ]
    }
  
    
    
  ];

const ProductCategoryPage: React.FC = () => {
  // Define the type for category param
  const { category } = useParams<RouteParams>();
  
  // Set the state type to Product[]
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Filter products based on the category from the URL
    const filtered = products.filter(product => product.category.toLowerCase() === category);
    setFilteredProducts(filtered);
  }, [category]);

  return (
    <IonPage>
      <IonContent>
        <IonGrid>
          <IonRow>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <IonCol size="6" key={product.id}>
                  <IonCard>
                    <img src={product.img} alt={product.name} />
                    <IonCardHeader>
                      <IonCardSubtitle>{product.code}</IonCardSubtitle>
                      <IonCardTitle>{product.name}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <p>{product.description}</p>
                      <p>Rating: {product.rating} ★</p>
                      <p>Status: {product.stockStatus}</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))
            ) : (
              <p>No products found in this category.</p>
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ProductCategoryPage;
