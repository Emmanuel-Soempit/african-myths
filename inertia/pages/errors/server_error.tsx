export default function ServerError(props: { error: any }) {
  console.log("Error", props)
  return (
    <>
      <div className="container">
        <div className="title">Server Error</div>

        <span>{props?.error}</span>
      </div>
    </>
  )
}