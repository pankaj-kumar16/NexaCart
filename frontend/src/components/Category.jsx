
import {
  Smartphone,
  Shirt,
  House,
  Headphones
} from 'lucide-react'

const categories = [
  {
    name: 'Electronics',
    description: 'Latest gadgets & devices',
    icon: Smartphone,
  },
  {
    name: 'Fashion',
    description: 'Style for every day',
    icon: Shirt,
  },
  {
    name: 'Home & Living',
    description: 'Make home feel better',
    icon: House,
  },
  {
    name: 'Accessories',
    description: 'Complete your style',
    icon: Headphones,
  },
]

function Category() {
  return (
    <section className="category-section">
      <div className="category-header">
        <div>
          <span className="section-label">EXPLORE</span>
          <h2>Shop by Category</h2>
          <p>Find everything you need in one place.</p>
        </div>
      </div>

      <div className="category-grid">
        {categories.map((category) => {
          const Icon = category.icon

          return (
            <div className="category-card" key={category.name}>
              <div className="category-icon">
                <Icon size={32} strokeWidth={1.7} />
              </div>

              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Category
