// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";

// const ProductForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState({
//     name: "",
//     price: "",
//     category: "",
//     description: "",
//     images: [],
//   });

//   useEffect(() => {
//     if (id) {
//       fetchProduct();
//     }
//   }, [id]);

//   const fetchProduct = async () => {
//     try {
//       const response = await axios.get(
//         `https://hammerhead-app-jkdit.ondigitalocean.app/admin/product/${id}`
//       );
//       console.log("API Response:", response.data); // Debugging

//       const productData = response.data.product;
//       let imagesArray = [];

//       try {
//         imagesArray = JSON.parse(productData.images);
//       } catch (error) {
//         console.warn("Error parsing images:", error);
//         imagesArray = Array.isArray(productData.images) ? productData.images : [productData.images];
//       }

//       setProduct({ ...productData, images: imagesArray });
//     } catch (error) {
//       console.error("Error fetching product:", error);
//     }
//   };

//   const handleChange = (e) => {
//     setProduct({ ...product, [e.target.name]: e.target.value });
//   };

//   const handleImageUpload = async (e) => {
//     const files = Array.from(e.target.files); // Convert FileList to Array
//     if (!files.length) return;

//     console.log("Selected files:", files); // ✅ Debugging

//     try {
//       // Show a loading message while uploading
//       toast.info("Uploading images... Please wait!", { autoClose: 2000 });

//       // Use `Promise.all` to upload all images concurrently
//       const uploadPromises = files.map(async (file) => {
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("upload_preset", "zairi_sucess"); // ✅ Correct Cloudinary Preset
//         formData.append("folder", "products");

//         const response = await axios.post(
//           "https://api.cloudinary.com/v1_1/dqvntxciv/image/upload",
//           formData
//         );

//         console.log("Cloudinary response:", response.data); // ✅ Debug Cloudinary Response
//         return response.data.secure_url; // Return the uploaded image URL
//       });

//       // Wait for all images to finish uploading
//       const uploadedImages = await Promise.all(uploadPromises);

//       // ✅ Ensure React state updates with new images
//       setProduct((prev) => ({
//         ...prev,
//         images: [...prev.images, ...uploadedImages], // Merge with existing images
//       }));

//       console.log("Final uploaded images before updating state:", uploadedImages);
//       toast.success("✅ Images uploaded successfully!");
//     } catch (error) {
//       console.error("Image upload error:", error.response?.data || error);
//       toast.error(`❌ Failed to upload images`);
//     }
//   };

//   const removeImage = (index) => {
//     const updatedImages = [...product.images];
//     updatedImages.splice(index, 1);
//     setProduct((prev) => ({
//       ...prev,
//       images: updatedImages,
//     }));
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   console.log("Images before submitting:", product.images); // ✅ Debug images

//   //   // ✅ Check if images exist before submission
//   //   if (product.images.length === 0) {
//   //     toast.error("❌ Please upload at least one image before submitting!");
//   //     return;
//   //   }

//   //   try {
//   //     const payload = {
//   //       ...product,
//   //       images: product.images, // ✅ Ensure images are sent as an array
//   //     };

//   //     console.log("Submitting payload:", payload); // ✅ Debug Payload

//   //     if (id) {
//   //       await axios.put(
//   //         `http://localhost:5000/admin/product/${id}`,
//   //         payload
//   //       );
//   //       toast.success("✅ Product updated successfully!");
//   //     } else {
//   //       await axios.post(
//   //         "https://hammerhead-app-jkdit.ondigitalocean.app/admin/products",
//   //         payload
//   //       );
//   //       toast.success("✅ Product added successfully!");
//   //     }

//   //     navigate("/products");
//   //   } catch (error) {
//   //     console.error("Error saving product:", error.response?.data || error);
//   //     toast.error("❌ Failed to save product");
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log("Images before submitting:", product.images); // ✅ Debug images

//     // ✅ Ensure images are sent as an array
//     const formattedImages = Array.isArray(product.images)
//       ? product.images
//       : product.images
//       ? [product.images]
//       : [];

//     try {
//       const payload = {
//         ...product,
//         images: formattedImages, // ✅ Fix: Always send images as an array
//       };

//       console.log("Submitting payload:", payload); // ✅ Debug Payload

//       if (id) {
//         await axios.put(
//           `https://hammerhead-app-jkdit.ondigitalocean.app/admin/product/${id}`,
//           payload
//         );
//         toast.success("✅ Product updated successfully!");
//       } else {
//         await axios.post(
//           "https://hammerhead-app-jkdit.ondigitalocean.app/admin/products",
//           payload
//         );
//         toast.success("✅ Product added successfully!");
//       }

//       navigate("/products");
//     } catch (error) {
//       console.error("❌ Error saving product:", error.response?.data || error);
//       toast.error("❌ Failed to save product");
//     }
//   };

//   return (
//     <Container fluid className="py-5">
//       <Card className="shadow-lg p-4 rounded w-100" style={{ maxWidth: "100%" }}>
//         <Card.Body>
//           <h2 className="text-center mb-4 fw-bold">
//             {id ? "✏️ Edit Product" : "➕ Add Product"}
//           </h2>
//           <Form onSubmit={handleSubmit}>
//             <Row className="mb-3">
//               {/* Product Name */}
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>Product Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="name"
//                     placeholder="Enter product name"
//                     value={product.name}
//                     onChange={handleChange}
//                     required
//                   />
//                 </Form.Group>
//               </Col>

//               {/* Price */}
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>Price</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="price"
//                     placeholder="Enter price"
//                     value={product.price}
//                     onChange={handleChange}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               {/* Category */}
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>Category</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="category"
//                     placeholder="Enter category"
//                     value={product.category}
//                     onChange={handleChange}
//                     required
//                   />
//                 </Form.Group>
//               </Col>

//               {/* Description */}
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>Description</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={3}
//                     name="description"
//                     placeholder="Enter product description"
//                     value={product.description}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             {/* Image Upload */}
//             <Form.Group className="mb-3">
//               <Form.Label>Upload Images (Multiple Allowed)</Form.Label>
//               <Form.Control type="file" multiple onChange={handleImageUpload} />
//             </Form.Group>

//             {/* Display Uploaded Images */}
//             <Row className="mb-3">
//               {product.images.length > 0 &&
//                 product.images.map((image, index) => (
//                   <Col key={index} xs={6} md={3} className="mb-3 position-relative">
//                     <img
//                       src={image}
//                       alt="Uploaded"
//                       className="img-thumbnail rounded shadow-sm"
//                       style={{
//                         width: "100%",
//                         height: "120px",
//                         objectFit: "cover",
//                       }}
//                     />
//                     <Button
//                       variant="danger"
//                       size="sm"
//                       className="position-absolute top-0 end-0 m-1"
//                       onClick={() => removeImage(index)}
//                     >
//                       ❌
//                     </Button>
//                   </Col>
//                 ))}
//             </Row>

//             {/* Submit Button */}
//             <Button variant="primary" type="submit" className="w-100 fw-bold">
//               {id ? "Update Product" : "Save Product"}
//             </Button>
//           </Form>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default ProductForm;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import { API_ROUTES } from "../config";

const slugify = (value) =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    short_name: "",
    slug: "",
    price: "",
    stock_quantity: "",
    category: "",
    subcategory: "",
    description: "",
    features: "",
    is_trendy: false,
    is_unique: false,
    sold_out: false,
    is_new: false,
    images: [],
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(API_ROUTES.adminProduct(id));
      const productData = response.data.product;
      let imagesArray = [];

      try {
        imagesArray = JSON.parse(productData.images);
      } catch (error) {
        imagesArray = Array.isArray(productData.images)
          ? productData.images
          : [productData.images];
      }

      setProduct({
        ...product,
        ...productData,
        images: imagesArray,
        slug: productData.slug || "",
        short_name: productData.short_name || "",
        features: productData.features || "",
        stock_quantity:
          productData.stock_quantity === null ||
          productData.stock_quantity === undefined
            ? ""
            : String(productData.stock_quantity),
        subcategory: productData.subcategory || "",
        is_trendy: !!productData.is_trendy,
        is_unique: !!productData.is_unique,
        sold_out: !!productData.sold_out,
        is_new: !!productData.new,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Unable to load product. Please retry.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => {
      if (name === "name") {
        return {
          ...prev,
          name: value,
          slug: prev.slug ? prev.slug : slugify(value),
        };
      }
      if (name === "slug") {
        return { ...prev, slug: slugify(value) };
      }
      if (name === "stock_quantity") {
        const sanitized =
          value === "" ? "" : Math.max(0, parseInt(value, 10) || 0);
        return { ...prev, stock_quantity: sanitized };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProduct({ ...product, [name]: checked });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    toast.info("Uploading images...");
    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "zairi_sucess");
        formData.append("folder", "products");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dqvntxciv/image/upload",
          formData
        );

        return response.data.secure_url;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));

      toast.success("Images uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...product.images];
    updatedImages.splice(index, 1);
    setProduct({ ...product, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (product.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setSaving(true);

    try {
      const primaryImage = product.images[0] || null;

      const payload = {
        name: product.name,
        short_name: product.short_name,
        slug: product.slug,
        price: Number(product.price),
        stock_quantity: Number(product.stock_quantity || 0),
        category: product.category?.trim().toLowerCase(),
        subcategory: product.subcategory?.trim().toLowerCase() || null,
        description: product.description,
        features: product.features,
        includes: [],
        gallery: product.images,
        category_image: primaryImage ? [primaryImage] : [],
        cart_image: primaryImage,
        first_image: primaryImage,
        is_trendy: product.is_trendy,
        is_unique: product.is_unique,
        sold_out: product.sold_out,
        new: product.is_new ? 1 : 0,
        images: Array.isArray(product.images)
          ? product.images
          : [product.images],
      };

      if (id) {
        await axios.put(API_ROUTES.adminProduct(id), payload);
        toast.success("Product updated successfully!");
      } else {
        await axios.post(API_ROUTES.adminProducts, payload);
        toast.success("Product added successfully!");
      }

      navigate("/products");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save product!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container fluid className="py-5">
      <Card
        className="shadow-lg p-4 rounded w-100"
        style={{ maxWidth: "100%" }}
      >
        <Card.Body>
          <h2 className="text-center mb-4 fw-bold">
            {id ? "✏️ Edit Product" : "➕ Add Product"}
          </h2>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={5}>
                <Form.Group>
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    value={product.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Short Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="short_name"
                    placeholder="Internal short label"
                    value={product.short_name}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Slug</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      name="slug"
                      placeholder="auto-generated slug"
                      value={product.slug}
                      onChange={handleChange}
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() =>
                        setProduct((prev) => ({
                          ...prev,
                          slug: slugify(prev.name || ""),
                        }))
                      }
                    >
                      Auto
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    value={product.price}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Stock Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock_quantity"
                    placeholder="Available pieces"
                    min="0"
                    value={product.stock_quantity}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    placeholder="Main category"
                    value={product.category}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Subcategory</Form.Label>
                  <Form.Control
                    type="text"
                    name="subcategory"
                    placeholder="Subcategory (optional)"
                    value={product.subcategory}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  <Form.Check
                    type="checkbox"
                    label="🔥 Trendy"
                    name="is_trendy"
                    checked={product.is_trendy}
                    onChange={handleCheckboxChange}
                  />
                  <Form.Check
                    type="checkbox"
                    label="💎 Unique"
                    name="is_unique"
                    checked={product.is_unique}
                    onChange={handleCheckboxChange}
                  />
                  <Form.Check
                    type="checkbox"
                    label="❌ Sold Out"
                    name="sold_out"
                    checked={product.sold_out}
                    onChange={handleCheckboxChange}
                  />
                  <Form.Check
                    type="checkbox"
                    label="✨ New"
                    name="is_new"
                    checked={product.is_new}
                    onChange={handleCheckboxChange}
                  />
                </div>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    placeholder="Add a meaningful summary"
                    value={product.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Features</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="features"
                    placeholder="Bullet list or narrative features"
                    value={product.features}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>


            <Form.Group className="mb-3">
              <Form.Label>Upload Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <Form.Text muted>Uploading to Cloudinary…</Form.Text>
              )}
            </Form.Group>

            <Row className="mb-4">
              {product.images.map((image, index) => (
                <Col key={index} xs={6} md={3} className="mb-3 position-relative">
                  <img
                    src={image}
                    alt="Uploaded"
                    className="img-thumbnail rounded shadow-sm"
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0 m-1"
                    onClick={() => removeImage(index)}
                  >
                    ❌
                  </Button>
                </Col>
              ))}
            </Row>

            <Button
              variant="primary"
              type="submit"
              className="w-100 fw-bold"
              disabled={saving || uploading}
            >
              {saving
                ? "Saving..."
                : id
                ? "Update Product"
                : "Save Product"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductForm;
