import { useParams } from 'react-router-dom';
export default function DetalleEvento() {
  const { id } = useParams();
  return <h1 className="text-3xl font-bold text-gray-800">Viendo evento con ID: {id}</h1>;
}