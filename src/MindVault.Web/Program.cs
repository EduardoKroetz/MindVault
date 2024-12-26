using MindVault.Extensions.Application;
using MindVault.Infrastructure;
using MindVault.Web;

var builder = WebApplication.CreateBuilder(args);

builder.AddServices();
builder.AddInfrastructure();
builder.AddApplicationServices();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
