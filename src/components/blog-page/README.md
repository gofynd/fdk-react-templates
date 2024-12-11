# BlogPage Component

The `BlogPage` component is used to display a detailed blog post, including the post's content, metadata (author, publish date), social media links, and related content (via `BlogTabs` and `BlogFooter`). It handles the fetching of blog data, formatting of dates, and displaying images and content dynamically.

## Features

- **Blog Metadata**: Displays the blog title, author, publish date, and tags.
- **Image Handling**: Displays the blog's featured image or a fallback image if none is available.
- **Social Links**: Displays social media links dynamically using the provided contact information.
- **Sidebar Display**: Conditionally displays the sidebar based on the `sliderProps`.
- **Content Rendering**: Uses `HTMLContent` to render the HTML content of the blog post.
- **Loader**: Displays a loading state when the blog details are being fetched.

## Props

| Prop Name              | Prop Type    | Default Value  | Description                                                                 |
|------------------------|--------------|----------------|-----------------------------------------------------------------------------|
| `contactInfo`           | object       | N/A            | The contact information containing social media links and other details.    |
| `blogDetails`           | object       | N/A            | The blog post details including title, author, content, and other metadata. |
| `sliderProps`           | object       | N/A            | Properties for controlling the blog slider and related content.             |
| `footerProps`           | object       | N/A            | Properties for the `BlogFooter` component.                                  |
| `getBlog`               | function     | N/A            | Function to fetch the blog data based on the `slug` URL parameter.          |
| `isBlogDetailsLoading`  | boolean      | false          | Flag indicating whether the blog details are loading.                       |

## Example Usage

```jsx
import React from "react";
import BlogPage from "fdk-react-templates/components/blog-page/blog-page";
import "fdk-react-templates/components/blog-page/blog-page.css";

const App = () => {
  const contactInfo = {
    social_links: {
      facebook: { link: "https://facebook.com", title: "Facebook" },
      twitter: { link: "https://twitter.com", title: "Twitter" },
    },
  };

  const blogDetails = {
    title: "How to Build a React App",
    author: { name: "John Doe" },
    publish_date: "2024-10-01T00:00:00Z",
    content: [{ value: "<p>This is a blog post.</p>" }],
    tags: ["React", "JavaScript"],
  };

  const footerProps = {
    footerText: "This is the footer.",
  };

  const getBlog = (slug) => {
    console.log("Fetching blog with slug:", slug);
  };

  const sliderProps = {
    show_filters: true,
    show_recent_blog: true,
    show_search: true,
    show_tags: true,
    show_top_blog: true,
    fallback_image: "",
    button_text: "Shop Now",
    autoplay: false,
    slide_interval: 1.5,
    btn_text: "Read More",
    loadingOption: "pagination",
    show_blog_slide_show: true,
    recentBlogs: [
      {
        title:
          "The Ultimate Guide to 30 Minimalist Streetwear Brands Elevating Simplicity",
        feature_image: {
          secure_url:
            "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/company/5178/applications/668765e1c984016d78222a21/blogs/pictures/free-featured/original/vvXhF5v8P-Blog-Banner.webp",
        },
        id: "6720865f5b6e9f456256f59e",
        author: {
          name: "Saurabh Mamidwar",
        },
        slug: "the-ultimate-guide-to-30-minimalist-streetwear-brands-elevating-simplicity",
      },
      {
        title: "A COLLABORATION TO REMEMBER Royal Enfield x Alpinestars",
        feature_image: {
          secure_url:
            "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/company/5178/applications/668765e1c984016d78222a21/blogs/pictures/free-featured/original/HgXy6d7Nt-A-COLLABORATION-TO-REMEMBER-Royal-Enfield-x-Alpinestars-Blog-Banner.webp",
        },
        id: "6710b8f33bc254d3fa829182",
        author: {
          name: "RE Crew",
        },
        slug: "a-collaboration-to-remember-royal-enfield-x-alpinestars",
      },
    ],
    topViewedBlogs: [
      {
        title:
          "The Ultimate Guide to 30 Minimalist Streetwear Brands Elevating Simplicity",
        feature_image: {
          secure_url:
            "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/company/5178/applications/668765e1c984016d78222a21/blogs/pictures/free-featured/original/vvXhF5v8P-Blog-Banner.webp",
        },
        id: "6720865f5b6e9f456256f59e",
        author: {
          name: "Saurabh Mamidwar",
        },
        slug: "the-ultimate-guide-to-30-minimalist-streetwear-brands-elevating-simplicity",
      },
      {
        title: "A COLLABORATION TO REMEMBER Royal Enfield x Alpinestars",
        feature_image: {
          secure_url:
            "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/company/5178/applications/668765e1c984016d78222a21/blogs/pictures/free-featured/original/HgXy6d7Nt-A-COLLABORATION-TO-REMEMBER-Royal-Enfield-x-Alpinestars-Blog-Banner.webp",
        },
        id: "6710b8f33bc254d3fa829182",
        author: {
          name: "RE Crew",
        },
        slug: "a-collaboration-to-remember-royal-enfield-x-alpinestars",
      },
      {
        title: "THE ESSENTIAL GUIDE TO MONSOON RIDES",
        feature_image: {
          secure_url:
            "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/company/5178/applications/668765e1c984016d78222a21/blogs/pictures/free-featured/original/VK1OQ7OR3-THE-ESSENTIAL-GUIDE-TO-MONSOON-RIDES-Blog-Banner.webp",
        },
        id: "6710b8743bc254d3fa82914f",
        author: {
          name: "ABC",
        },
        slug: "the-essential-guide-to-monsoon-rides",
      },
      {
        title: "KERALA TO LEH THE RIDE OF MY LIFE",
        feature_image: {
          secure_url:
            "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/company/5178/applications/668765e1c984016d78222a21/blogs/pictures/free-featured/original/EH0fvjBdM-KERALA-TO-LEH-THE-RIDE-OF-MY-LIFE-Blog-Banner.webp",
        },
        id: "6710b9f23bc254d3fa82925f",
        author: {
          name: "Arjun",
        },
        slug: "kerala-to-leh-the-ride-of-my-life",
      },
    ],
  };

  const isBlogDetailsLoading = false;

  return (
    <div>
      <BlogPage
        contactInfo={contactInfo}
        blogDetails={blogDetails}
        sliderProps={sliderProps}
        footerProps={footerProps}
        getBlog={getBlog}
        isBlogDetailsLoading={isBlogDetailsLoading}
      />
    </div>
  );
};

export default App;

```

## Contact

For any questions or feedback, please contact Sandeep Baikan at [sandeepbaikan@fynd-external.com](mailto:sandeepbaikan@fynd-external.com).