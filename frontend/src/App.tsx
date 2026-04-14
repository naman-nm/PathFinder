import { useEffect, useState } from "react";

import CategoryTabs, {
  type ResourceCategory as TabCategory,
} from "./components/CatergoryTab";

import ResourceCard from "./components/ResourceCard";

import ResourceHero from "./components/ResourceHero";
import ResourceStateNotice from "./components/ResourceStateNotice";

import AdminPanel from "./components/admin/AdminPanel";
import AdminAuth from "./components/AdminAuth";

import { PATHFINDER_PILLARS } from "./data/resources";

import { getResourcesWithJWT } from "./api/resourceAdminApi";



function getRouteType(pathname: string) {

  const cleanedPath = pathname.replace(/\/+$/, "") || "/";

  if (cleanedPath === "/" || cleanedPath === "/resources") {
    return { type: "library" as const };
  }

  if (cleanedPath === "/admin") {
    return { type: "admin" as const };
  }

  return { type: "not-found" as const };

}



function App() {

  const [resources, setResources] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [activeCategory, setActiveCategory] =
    useState<TabCategory>("all");

  const [currentPath, setCurrentPath] =
    useState(() => window.location.pathname);

  const token =
    localStorage.getItem("admin_token");



  /*
  HANDLE ROUTING
  */

  useEffect(() => {

    const handlePopState = () =>
      setCurrentPath(window.location.pathname);

    window.addEventListener("popstate", handlePopState);

    return () =>
      window.removeEventListener("popstate", handlePopState);

  }, []);



  const navigateTo = (path: string) => {

    if (window.location.pathname !== path) {

      window.history.pushState({}, "", path);

      setCurrentPath(path);

    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };



  const route =
    getRouteType(currentPath);



  /*
  FETCH ALL RESOURCES FROM BACKEND
  */

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        const data =
          await getResourcesWithJWT();

        setResources(data);

      }
      catch (err) {

        console.error(err);

        setError(
          "Unable to load resources"
        );

      }
      finally {

        setLoading(false);

      }

    };

    fetchData();

  }, []);



  /*
  FILTER
  */

  const normalizedQuery =
    searchQuery.toLowerCase();



  const filteredResources =
    resources.filter((r) => {

      const matchSearch =
        r.title
          ?.toLowerCase()
          .includes(normalizedQuery);

      const matchCategory =
        activeCategory === "all" ||
        r.category === activeCategory;

      return matchSearch && matchCategory;

    });



  /*
  ADMIN PAGE
  */

  if (route.type === "admin") {
    const token = localStorage.getItem("admin_token");  
    if (!token) {
      return <AdminAuth />;
    }
    return <AdminPanel />;
  }

  /*
  NOT FOUND
  */

  if (route.type === "not-found") {

    return (

      <ResourceStateNotice
        title="Page not found"
        description="Invalid route"
      />

    );

  }



  /*
  MAIN PAGE
  */

  return (

    <main className="resource-shell">

      <ResourceHero
        onSearch={setSearchQuery}
      />



      {/* PILLARS */}

      <section className="resource-pillars">

        {PATHFINDER_PILLARS.map((pillar) => (

          <div key={pillar.title}>

            <h3>
              {pillar.title}
            </h3>

            <p>
              {pillar.description}
            </p>

          </div>

        ))}

      </section>



      {/* CATEGORY FILTER */}

      <CategoryTabs

        activeCategory={activeCategory}

        onSelect={setActiveCategory}

        counts={{
          all: resources.length,
        }}

      />



      {/* RESOURCE LIST */}

      <section className="resource-content">

        {loading && (

          <ResourceStateNotice
            title="Loading..."
            description="Fetching resources from backend"
          />

        )}



        {error && (

          <ResourceStateNotice
            title="Error"
            description={error}
          />

        )}



        {!loading &&
          filteredResources.length > 0 && (

            <div className="resource-grid">

              {filteredResources.map((resource) => (

                <ResourceCard

                  key={resource.id}

                  id={resource.id}

                  title={resource.title}

                  description={resource.description}

                  category={resource.category}

                  resourceType={resource.resource_type}

                  slug={resource.slug}

                  thumbnail={
                    resource.thumbnail_url
                  }

                  tags={resource.tags}

                  readTime={
                    resource.read_time
                  }

                  actionLabel="View Details"

                  onAction={() =>
                    console.log(
                      resource.slug
                    )
                  }

                />

              ))}

            </div>

          )}



        {!loading &&
          filteredResources.length === 0 && (

            <ResourceStateNotice
              title="No resources"
              description="No matching results"
            />

          )}



        {/* ADMIN BUTTON */}

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
          }}
        >

          <button

            onClick={() =>
              navigateTo("/admin")
            }

            style={{
              padding: "12px 24px",
              background: "#C8F135",
              border: "none",
              borderRadius: "10px",
              fontWeight: 600,
              cursor: "pointer",
            }}

          >

          Admin Access

          </button>

        </div>

      </section>

    </main>

  );

}



export default App;