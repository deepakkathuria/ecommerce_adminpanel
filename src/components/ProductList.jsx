// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Button, Table, Card } from "react-bootstrap";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(
//         "https://hammerhead-app-jkdit.ondigitalocean.app/admin/products"
//       );
//       setProducts(response.data.products);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   const deleteProduct = async (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         await axios.delete(
//           `https://hammerhead-app-jkdit.ondigitalocean.app/admin/product/${id}`
//         );
//         fetchProducts();
//       } catch (error) {
//         console.error("Error deleting product:", error);
//       }
//     }
//   };

//   return (
//     <div className="container my-5">
//       <h2 className="mb-1 text-center">📦 Manage Products</h2>
//       <Card 
//       className="shadow-sm">
//         <Card.Body>
//           <Table striped bordered hover responsive>
//             <thead className="bg-dark text-white">
//               <tr>
//                 <th>ID</th>
//                 <th>Image</th>
//                 <th>Name</th>
//                 <th>Price</th>
//                 <th>Category</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((product) => {
//                 let images = [];
//                 try {
//                   images = JSON.parse(product.images); // Ensure images are parsed correctly
//                 } catch (error) {
//                   console.error("Error parsing images:", error);
//                 }

//                 const firstImage =
//                   images.length > 0 ? images[0] : "https://via.placeholder.com/100";

//                 return (
//                   <tr key={product.item_id} className="text-center align-middle">
//                     <td>{product.item_id}</td>
//                     <td>
//                       <img
//                         src={firstImage}
//                         alt={product.name}
//                         className="img-thumbnail"
//                         style={{ width: "80px", height: "80px", objectFit: "cover" }}
//                       />
//                     </td>
//                     <td className="fw-bold">{product.name}</td>
//                     <td className="text-success fw-bold">Rs. {product.price}</td>
//                     <td className="text-primary">{product.category}</td>
//                     <td>
//                       <Link to={`/edit-product/${product.item_id}`}>
//                         <Button variant="outline-primary" size="sm" className="me-2">
//                           ✏️ Edit
//                         </Button>
//                       </Link>
//                       <Button
//                         variant="outline-danger"
//                         size="sm"
//                         onClick={() => deleteProduct(product.item_id)}
//                       >
//                         🗑 Delete
//                       </Button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default ProductList;




import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table, Card, Pagination } from "react-bootstrap";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 15; // Products per page

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page) => {
    try {
      const response = await axios.get(
        `https://hammerhead-app-jkdit.ondigitalocean.app/admin/products?page=${page}&limit=${limit}`
      );

      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `https://hammerhead-app-jkdit.ondigitalocean.app/admin/product/${id}`
        );
        fetchProducts(currentPage);
      } catch (error) {
        console.error("❌ Error deleting product:", error);
      }
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-1 text-center">📦 Manage Products</h2>
      <Card className="shadow-sm">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead className="bg-dark text-white">
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                let images = [];
                try {
                  images = JSON.parse(product.images); // Ensure images are parsed correctly
                } catch (error) {
                  console.error("❌ Error parsing images:", error);
                }

                const firstImage =
                  images.length > 0 ? images[0] : "https://via.placeholder.com/100";

                return (
                  <tr key={product.item_id} className="text-center align-middle">
                    <td>{product.item_id}</td>
                    <td>
                      <img
                        src={firstImage}
                        alt={product.name}
                        className="img-thumbnail"
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      />
                    </td>
                    <td className="fw-bold">{product.name}</td>
                    <td className="text-success fw-bold">Rs. {product.price}</td>
                    <td className="text-primary">{product.category}</td>
                    <td>
                      <Link to={`/edit-product/${product.item_id}`}>
                        <Button variant="outline-primary" size="sm" className="me-2">
                          ✏️ Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteProduct(product.item_id)}
                      >
                        🗑 Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {/* Pagination Component */}
          <Pagination className="justify-content-center">
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductList;
