import React, { useState, useEffect } from "react";
import CardComponent from "../../Components/Blog/CardComponent";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import Faq from "../../Components/Faq/Faq";
import Banner from "../../Components/Banner/Banner";
import Find from "../../Components/FindOut/Find";
import CustomPagination from "../../Components/Blog/CustomPagination";
import { useTranslation } from 'react-i18next';

const Blog = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const itemsPerPage = 3;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTotalBlogs = (count) => {
    setTotalBlogs(count);
  };

  const totalPages = Math.ceil(totalBlogs / itemsPerPage);

  return (
    <>
      <NavBar />
      <Banner pageName={t('blog.banner.title')} />
      <CardComponent 
        currentPage={currentPage} 
        itemsPerPage={itemsPerPage} 
        onTotalBlogs={handleTotalBlogs}
      />
      {totalBlogs > 0 && (
        <CustomPagination
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

export default Blog;