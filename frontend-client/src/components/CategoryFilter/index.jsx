import React from 'react';

const CategoryFilter = ({ categories = [], selectedCategory, onSelectCategory }) => {
  // Ensure categories is an array
  const categoriesList = Array.isArray(categories) ? categories : [];
  
  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => onSelectCategory(null)}
          className={`category-btn ${
            !selectedCategory 
              ? 'category-btn-active' 
              : 'category-btn-inactive'
          }`}
        >
          All Cars
        </button>
        
        {categoriesList.map((category) => (
          <button
            key={category.id || category._id}
            onClick={() => onSelectCategory(category.id || category._id)}
            className={`category-btn ${
              selectedCategory === (category.id || category._id)
                ? 'category-btn-active'
                : 'category-btn-inactive'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter; 