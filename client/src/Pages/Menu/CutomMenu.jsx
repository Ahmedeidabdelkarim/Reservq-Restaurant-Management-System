import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import Faq from "../../Components/Faq/Faq";
import Banner from "../../Components/Banner/Banner";
import Find from "../../Components/FindOut/Find";
import CustomPagination from "../../Components/Blog/CustomPagination";
import Menu from "../../Components/Menu/Menu";
import ItemFilter from "../../Components/Menu/ItemFilter";

const CutomMenu = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL}/api/v1/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = useCallback((searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      setCurrentPage(1);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <NavBar />
      <Banner pageName={t('menu.title')} />
      <ItemFilter onSearch={handleSearch} />
      <Menu products={currentProducts} loading={loading} />
      {!loading && filteredProducts.length > 0 && (
        <CustomPagination
          className={`d-flex align-items-center justify-content-center mb-5 pb-5 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      <Faq />
      <Find />
      <Footer />
    </>
  );
};

export default CutomMenu;