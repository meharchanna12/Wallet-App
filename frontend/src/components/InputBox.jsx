export default function InputBox({label, placeholder, value, onChange}) {
  return (
      <div className="mb-4">
          <div className="text-sm font-medium text-gray-600">{label}</div>
          <input
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
      </div>
  );
}
