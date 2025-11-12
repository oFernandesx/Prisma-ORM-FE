import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import prisma from '@/lib/prisma-client'
import AddPedidos from './_components/add-pedidos'
import EditPedidos from './_components/edit-pedidos'
import DeletePedidos from './_components/delete-pedidos'

export default async function PedidosPage() {
  const [pedidos, produtos] = await Promise.all([
    prisma.pedido.findMany({
      include: {
        produtos: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.produto.findMany({
      include: {
        categoria: true,
      },
      orderBy: {
        nome: 'asc',
      },
    }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <AddPedidos produtos={produtos} />
      </div>

      {pedidos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-8 text-center text-muted-foreground">
          <p>Nenhum pedido cadastrado</p>
          <p className="text-sm">Clique em "Novo Pedido" para criar seu primeiro pedido.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Quantidade de Itens</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell className="font-medium">{pedido.nome}</TableCell>
                  <TableCell>{pedido.telefone}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{pedido.endereco}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {pedido.produtos.map((pp) => (
                        <span
                          key={pp.id}
                          className="inline-block rounded-full bg-muted px-2 py-1 text-xs"
                        >
                          {pp.produto.nome} ({pp.quantidade})
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{pedido.produtos.length}</TableCell>
                  <TableCell className="flex items-center justify-end gap-2">
                    <EditPedidos pedido={pedido} produtos={produtos} />
                    <DeletePedidos pedido={pedido} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
