const API_BASE = "http://localhost:5000/api/categories/";

export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}list`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    // Assuming the response is { data: [{ category_name: 'Luxury' }, ...] }
    const names = (data.data || []).map((cat) => ({value:cat.category_name, key: cat.category_id}));
    return names;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}

// export async function listCategoryById(category_id) {
//   try {
//     const res = await fetch(`${API_BASE}byid`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ category_id }), // sending the ID in the body
//     });

//     if (!res.ok) throw new Error(`Server error: ${res.status}`);
//     return await res.json();
//   } catch (err) {
//     console.error("Fetch error:", err);
//     throw err;
//   }
// }

export async function listSubcategoriesByCategoryId(category_id) {
  try {
    const res = await fetch(`${API_BASE}subcategorybycategoryid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category_id }), // sending the ID in the body
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    console.log("Response from subcategories:", res);
    const data = await res.json();
    const names = (data.data || []).map((cat) => ({value:cat.name, key: cat.id}));
    return names;
  } catch (err) {
    //console.log("SubCategories:  No Categories Available at the Moment")
    names = 'SubCategories:  No Categories Available at the Moment';
    console.log(names)
    return names
    // console.error("Fetch error:", err);
    //throw err;
  }
}