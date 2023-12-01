'use client'

function CustomCodeRenderer({ data }: any) {
  (data)

  return (
    <pre className='bg-gray-600 rounded-md p-4 overflow-hidden max-w-5xl'>
      <code className='text-gray-100 text-sm'>{data.code}</code>
    </pre>
  )
}

export default CustomCodeRenderer