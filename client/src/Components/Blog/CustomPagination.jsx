import React from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="d-flex align-items-center justify-content-center mb-5 pb-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <Button
        variant="outline-secondary"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={isRTL ? "ms-2" : "me-2"}
      >
        {isRTL ? "→" : "←"} {t('menu.pagination.previous')}
      </Button>

      {getPageNumbers().map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "danger" : "outline-secondary"}
          onClick={() => onPageChange(page)}
          className="mx-1"
        >
          {page}
        </Button>
      ))}

      <Button
        variant="danger"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2"
      >
        {t('menu.pagination.next')} {isRTL ? "←" : "→"}
      </Button>

      <span className={isRTL ? "me-3" : "ms-3"}>
        {t('menu.pagination.page')} <strong>{currentPage}</strong> {t('menu.pagination.of')} {totalPages}
      </span>
    </div>
  );
};

export default CustomPagination;
