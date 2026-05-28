export default function handler(req, res) {
  res.json({
    test: process.env.NEXT_PUBLIC_TEST_VALUE || "Not found"
  });
}
