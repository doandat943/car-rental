import React from 'react';

const CategoryFilter = ({ categories = [], selectedCategory, onSelectCategory }) => {
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
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`category-btn ${
              selectedCategory === category.id
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