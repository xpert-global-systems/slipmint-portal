import fs from "fs";
import path from "path";
import Layout from "../../components/Layout";

export default function NewsPost({ content }) {
  return (
    <Layout>
      <div style={{
        maxWidth: "850px",
        margin: "60px auto",
        padding: "20px",
        lineHeight: "1.7",
        color: "#e8eaf0",
        fontSize: "17px"
      }}>
        <article dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const filePath = path.join(process.cwd(), "generated", `${params.slug}.md`);

  // If file doesn't exist, show 404
  if (!fs.existsSync(filePath)) {
    return {
      notFound: true,
    };
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");

  return {
    props: {
      content: fileContent,
    },
  };
}
