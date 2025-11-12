import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/prisma-client'
import AddProdutos from './_components/add-produtos'
import EditProdutos from './_components/edit-produtos'
import DeleteProdutos from './_components/delete-produtos'

export default async function ProdutosPage() {
  const [produtos, categorias] = await Promise.all([
    prisma.produto.findMany({
      include: {
        categoria: true,
      },
      orderBy: {
        nome: 'asc',
      },
    }),
    prisma.categorias.findMany({
      orderBy: {
        nome: 'asc',
      },
    }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Produtos</h1>
        <AddProdutos categorias={categorias} />
      </div>

      {produtos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-8 text-center text-muted-foreground">
          <p>Nenhum produto cadastrado</p>
          <p className="text-sm">Clique em "Adicionar Produto" para criar seu primeiro produto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {produtos.map((produto) => (
            <Card key={produto.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-1 text-lg">{produto.nome}</CardTitle>
                <p className="text-xs text-muted-foreground">{produto.categoria.nome}</p>
              </CardHeader>
              <CardContent className="space-y-2 pb-3">
                {produto.descricao && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{produto.descricao}</p>
                )}
                <p className="text-lg font-semibold text-green-600">
                  R$ {produto.preco.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">ID: {produto.id}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-end gap-2">
                <EditProdutos produto={produto} categorias={categorias} />
                <DeleteProdutos produto={produto} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
