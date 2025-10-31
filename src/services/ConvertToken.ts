
export default function ConvertToken(){
  try {
    return true;
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}
