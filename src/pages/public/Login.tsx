import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Acceso a Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input placeholder="ejemplo@cudeca.org" type="email" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Contraseña</label>
            <Input type="password" />
          </div>
          <Button className="w-full">Entrar</Button>

          <div className="text-center text-sm text-cudeca-gris-texto pt-2">
            Probando colores:
            <span className="text-cudeca-naranja font-bold ml-1">Naranja</span> y
            <span className="text-cudeca-rojo font-bold ml-1">Rojo</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
