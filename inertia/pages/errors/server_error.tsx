export default function ServerError(props: { error?: { message?: string; stack?: string } }) {
  console.log("Error", props)
  return (
    <>
      <div className="container">
        <div className="title">Server Error</div>

        <span>{props?.error?.message}</span>
      </div>
    </>
  )
}
