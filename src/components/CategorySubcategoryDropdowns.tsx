
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getCategories, listSubcategoriesByCategoryId } from '@/services/categories';
import { MultiSelect } from 'primereact/multiselect';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface Category {
  name: string;
  code: string;
}

interface Subcategory {
  name: string;
  code: string;
}

interface CategorySubcategoryDropdownsProps {
  selectedCategory: string;
  selectedSubcategories: string[];
  onCategoryChange: (category: string) => void;
  onSubcategoriesChange: (subcategories: string[]) => void;
  className?: string;
}

const CategorySubcategoryDropdowns: React.FC<CategorySubcategoryDropdownsProps> = ({
  selectedCategory,
  selectedSubcategories,
  onCategoryChange,
  onSubcategoriesChange,
  className = ''
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        const transformed = data.map((cat: any) => ({
          name: cat.value,
          code: String(cat.key),
        }));
        setCategories(transformed);
        console.log("Categories loaded:", transformed);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };

    loadCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const loadSubcategories = async () => {
      if (!selectedCategory) {
        setSubcategories([]);
        onSubcategoriesChange([]);
        return;
      }

      setLoading(true);
      try {
        const category = categories.find(
          (cat) => cat.name === selectedCategory || cat.code === selectedCategory
        );
        
        if (!category) {
          setLoading(false);
          return;
        }

        const data = await listSubcategoriesByCategoryId(category.code);
        const transformed = data.map((subcat: any) => ({
          name: subcat.value,
          code: String(subcat.key),
        }));

        setSubcategories(transformed);
        console.log("Subcategories loaded:", transformed);

        // Filter out invalid subcategories from current selection
        const validSubcategories = selectedSubcategories.filter((code) =>
          transformed.some((subcat: Subcategory) => subcat.code === code)
        );

        if (validSubcategories.length !== selectedSubcategories.length) {
          onSubcategoriesChange(validSubcategories);
        }
      } catch (err) {
        console.error('Failed to load subcategories', err);
        setSubcategories([]);
        onSubcategoriesChange([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubcategories();
  }, [selectedCategory, categories]);

  const handleCategoryChange = (value: string) => {
    console.log("Category changed to:", value);
    onCategoryChange(value);
    onSubcategoriesChange([]);
  };

  const handleSubcategoryChange = (e: any) => {
    const selectedCodes = e.value || [];
    console.log("Subcategories changed to:", selectedCodes);
    onSubcategoriesChange(selectedCodes);
  };

  const getSelectedSubcategoryNames = () => {
    return selectedSubcategories
      .map(code => subcategories.find(sub => sub.code === code)?.name)
      .filter(Boolean);
  };

  const customValueTemplate = (option: Subcategory[]) => {
    if (!option || option.length === 0) {
      return <span className="text-gray-500">Select subcategories</span>;
    }

    if (option.length <= 2) {
      return (
        <div className="flex flex-wrap gap-1">
          {option.map((item, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {item.name}
            </Badge>
          ))}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <Badge variant="secondary" className="text-xs">
          {option[0].name}
        </Badge>
        <span className="text-sm text-gray-600">
          +{option.length - 1} more
        </span>
      </div>
    );
  };

  return (
    <div className={`flex flex-col md:flex-row gap-4 w-full ${className}`}>
      {/* Category Selection */}
      <div className="flex-1 min-w-[200px] space-y-2">
        <Label htmlFor="category">
          Category <span className="text-red-500">*</span>
        </Label>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full h-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {categories.map((category) => (
              <SelectItem
                key={category.code}
                value={category.code}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subcategory Multi-Selection */}
      <div className="flex-1 min-w-[200px] space-y-2">
        <Label htmlFor="subcategories">
          Subcategories <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <MultiSelect
            id="subcategories"
            value={selectedSubcategories}
            onChange={handleSubcategoryChange}
            options={subcategories}
            optionLabel="name"
            optionValue="code"
            filter
            filterPlaceholder="Search subcategories..."
            placeholder={
              !selectedCategory
                ? "Select category first"
                : loading
                ? "Loading subcategories..."
                : "Select subcategories"
            }
            maxSelectedLabels={0}
            selectedItemsLabel="{0} sub-categories selected"
            disabled={!selectedCategory || loading}
            className="w-full min-h-[48px]"
            panelClassName="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            style={{
              minHeight: '20px',
              border: '1px solid #d1d5db',
              borderRadius: '5px',
            }}
            pt={{
              root: {
                style: { width: '90%', minHeight: '50px' }
              },
              input: {
                style: { 
                  padding: '10px',
                  fontSize: '10px',
                  minHeight: '10px',
                  border: 'none',
                  outline: 'none'
                }
              },
              panel: {
                style: { 
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  zIndex: 50,
                  marginTop: '4px',
                  maxHeight: '150px'
                }
              },
              wrapper: {
                style: { maxHeight: '200px', overflowY: 'auto' }
              },
              item: {
                style: {
                  padding: '12px',
                  fontSize: '14px',
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer'
                }
              },
              filterContainer: {
                style: {
                  padding: '12px',
                  borderBottom: '1px solid #f3f4f6'
                }
              },
              filterInput: {
                style: {
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }
              },
              token: {
                style: {
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  fontSize: '12px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  marginRight: '4px',
                  marginBottom: '2px'
                }
              }
            }}
          />
        </div>

        {/* Selected Subcategories Display */}
        {selectedSubcategories.length > 0 && (
          <div className="mt-3">
            {/* <div className="text-xs text-gray-600 mb-2">
              Selected ({selectedSubcategories.length}):
            </div> */}
            <div className="flex flex-wrap gap-2">
              {getSelectedSubcategoryNames().map((name, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-blue- text-blue-700 border-blue-200 text-xs px-2 py-1"
                >
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="text-xs text-gray-500 mt-1">
            Loading subcategories...
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySubcategoryDropdowns;
